const test = require('node:test');
const assert = require('node:assert/strict');
const { createUSSDHandler } = require('../src/handlers');

function memoryStore() {
  const sessions = new Map();
  return { get: async (id) => sessions.get(id), set: async (id, value) => sessions.set(id, structuredClone(value)) };
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
  await handler({ sessionId: 'b', phoneNumber: '0999000000', text: '1*0000' });
  assert.match(await handler({ sessionId: 'b', phoneNumber: '0999000000', text: '1*0000' }), /^END Too many PIN attempts/);
});

test('invalid language selection has exactly one CON prefix', async () => {
  const handler = createUSSDHandler({ store: memoryStore(), authenticate: async () => false });
  assert.match(await handler({ sessionId: 'c', phoneNumber: '0999000000', text: '3' }), /^CON Invalid choice/);
});
