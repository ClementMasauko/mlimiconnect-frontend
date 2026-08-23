const test = require('node:test');
const assert = require('node:assert/strict');
const { createUSSDHandler } = require('../src/handlers');
const { createApp } = require('../src/index');

function memoryStore() {
  const sessions = new Map();
  return { get: async (id) => sessions.get(id), set: async (id, value) => { sessions.set(id, structuredClone(value)); return 'OK'; }, ping: async () => 'PONG' };
}

test('USSD flow authenticates only through the verifier', async () => {
  const handler = createUSSDHandler({ store: memoryStore(), authenticate: async ({ pin }) => pin === '1234' });
  assert.match(await handler({ sessionId: 'a', phoneNumber: '0999000000', text: '' }), /^CON Welcome/);
  assert.match(await handler({ sessionId: 'a', phoneNumber: '0999000000', text: '1' }), /Enter your 4-digit PIN/);
  assert.match(await handler({ sessionId: 'a', phoneNumber: '0999000000', text: '1*1234' }), /Welcome! Choose action/);
});

test('USSD locks the session after repeated invalid PIN attempts', async () => {
  const handler = createUSSDHandler({ store: memoryStore(), authenticate: async () => false, now: () => 0 });
  await handler({ sessionId: 'b', phoneNumber: '0999000000', text: '1' });
  await handler({ sessionId: 'b', phoneNumber: '0999000000', text: '1*0000' });
  await handler({ sessionId: 'b', phoneNumber: '0999000000', text: '1*0000*0000' });
  assert.match(await handler({ sessionId: 'b', phoneNumber: '0999000000', text: '1*0000*0000*0000' }), /^END Too many PIN attempts/);
});

test('invalid language selection has exactly one CON prefix', async () => {
  const handler = createUSSDHandler({ store: memoryStore(), authenticate: async () => false });
  assert.match(await handler({ sessionId: 'c', phoneNumber: '0999000000', text: '3' }), /^CON Invalid choice \/ Sankho silolondola/);
});

test('provider retries return the identical response without consuming another attempt', async () => {
  let authenticationCalls = 0;
  const handler = createUSSDHandler({ store: memoryStore(), authenticate: async () => { authenticationCalls += 1; return false; } });
  await handler({ sessionId: 'retry', phoneNumber: '+265999000000', text: '1' });
  const first = await handler({ sessionId: 'retry', phoneNumber: '+265999000000', text: '1*0000' });
  const retry = await handler({ sessionId: 'retry', phoneNumber: '+265999000000', text: '1*0000' });
  assert.equal(retry, first);
  assert.equal(authenticationCalls, 1);
});

test('phone lockout survives a new session id', async () => {
  const store = memoryStore();
  const handler = createUSSDHandler({ store, authenticate: async () => false, now: () => 1000, config: { maxPinAttempts: 1, lockoutSeconds: 60 } });
  await handler({ sessionId: 'old', phoneNumber: '0999000000', text: '1' });
  await handler({ sessionId: 'old', phoneNumber: '0999000000', text: '1*0000' });
  assert.match(await handler({ sessionId: 'new', phoneNumber: '0999000000', text: '' }), /^END Too many PIN attempts/);
});

test('rejects malformed Malawi phone numbers and cross-phone session reuse', async () => {
  const handler = createUSSDHandler({ store: memoryStore(), authenticate: async () => true });
  assert.equal(await handler({ sessionId: 'bad', phoneNumber: '123', text: '' }), 'END Invalid USSD request. / Pempho la USSD silolondola.');
  await handler({ sessionId: 'shared', phoneNumber: '0999000000', text: '' });
  assert.equal(await handler({ sessionId: 'shared', phoneNumber: '0888000000', text: '1' }), 'END Invalid USSD session. / Nthawi ya USSD si yolondola.');
});

test('complete Chichewa advisory journey stays in Chichewa', async () => {
  const handler = createUSSDHandler({ store: memoryStore(), authenticate: async ({ pin }) => pin === '1234' });
  assert.match(await handler({ sessionId: 'ny', phoneNumber: '0999000000', text: '2' }), /^CON Lowetsani PIN yanu/);
  assert.match(await handler({ sessionId: 'ny', phoneNumber: '0999000000', text: '2*1234' }), /Mwalandiridwa! Sankhani/);
  assert.match(await handler({ sessionId: 'ny', phoneNumber: '0999000000', text: '2*1234*2' }), /^CON Menu ya Upangiri/);
  assert.match(await handler({ sessionId: 'ny', phoneNumber: '0999000000', text: '2*1234*2*1' }), /^CON Lowetsani boma lanu/);
  assert.equal(await handler({ sessionId: 'ny', phoneNumber: '0999000000', text: '2*1234*2*1*Lilongwe' }), 'END Nyengo ya Lilongwe sikupezeka panopa.');
});

test('invalid advisory choice stays in the advisory menu', async () => {
  const handler = createUSSDHandler({ store: memoryStore(), authenticate: async () => true });
  await handler({ sessionId: 'menu', phoneNumber: '0999000000', text: '1' });
  await handler({ sessionId: 'menu', phoneNumber: '0999000000', text: '1*1234' });
  await handler({ sessionId: 'menu', phoneNumber: '0999000000', text: '1*1234*2' });
  assert.match(await handler({ sessionId: 'menu', phoneNumber: '0999000000', text: '1*1234*2*9' }), /^CON Invalid choice/);
});

test('HTTP callback accepts provider form encoding and readiness checks the store', async (t) => {
  const store = memoryStore();
  const server = createApp({ store, authenticate: async () => true }).listen(0);
  t.after(() => server.close());
  await new Promise(resolve => server.once('listening', resolve));
  const base = `http://127.0.0.1:${server.address().port}`;
  const ready = await fetch(`${base}/ready`);
  assert.equal(ready.status, 200);
  const callback = await fetch(`${base}/ussd`, { method: 'POST', headers: { 'content-type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams({ sessionId: 'http', phoneNumber: '+265999000000', text: '' }) });
  assert.equal(callback.status, 200);
  assert.match(callback.headers.get('content-type'), /^text\/plain/);
  assert.match(await callback.text(), /^CON Welcome/);
});
