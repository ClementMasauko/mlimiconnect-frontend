const { verifyPin } = require('./auth');

const positiveInteger = (value, fallback) => {
  const parsed = Number.parseInt(value ?? '', 10);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
};

const normalizePhone = (value) => {
  const digits = String(value ?? '').replace(/[^\d+]/g, '');
  const normalized = digits.startsWith('+265') ? digits : digits.startsWith('265') ? `+${digits}` : digits.startsWith('0') ? `+265${digits.slice(1)}` : '';
  return /^\+265[789]\d{8}$/.test(normalized) ? normalized : null;
};

const message = (session, english, chichewa = english) => session.language === 'ny' ? chichewa : english;
const cleanInput = (value) => String(value ?? '').replace(/[\r\n*]/g, ' ').trim().slice(0, 40);

function createUSSDHandler({ store, authenticate = verifyPin, services = {prices:async()=>({items:[]}),orders:async()=>({items:[]}),weather:async()=>{throw new Error()},pest:async()=>{throw new Error()},support:async()=>({phone:'support@mlimiconnect.mw',hours:''})}, now = () => Date.now(), config = {} }) {
  if (!store?.get || !store?.set) throw new Error('A compatible session store is required');
  const sessionTtl = positiveInteger(config.sessionTtl ?? process.env.SESSION_TTL, 300);
  const maxAttempts = positiveInteger(config.maxPinAttempts ?? process.env.MAX_PIN_ATTEMPTS, 3);
  const lockoutSeconds = positiveInteger(config.lockoutSeconds ?? process.env.PIN_LOCKOUT_SECONDS, 900);

  return async function handleUSSD(payload = {}) {
    const correlationId = cleanInput(payload.correlationId);
    const sessionId = cleanInput(payload.sessionId);
    const phone = normalizePhone(payload.phoneNumber);
    const fullText = String(payload.text ?? '').trim().slice(0, 500);
    if (!sessionId || !phone) return 'END Invalid USSD request. / Pempho la USSD silolondola.';

    const sessionKey = `ussd:session:${sessionId}`;
    const session = (await store.get(sessionKey)) ?? { step: 0, language: 'en', phone, authenticated: false, attempts: 0 };
    if (session.phone !== phone) return 'END Invalid USSD session. / Nthawi ya USSD si yolondola.';
    const lockKey = `ussd:lock:${phone}`;
    const locked = await store.get(lockKey);
    if (locked?.until && locked.until > now()) return `END ${message(session, 'Too many PIN attempts. Please try again later.', 'Mwayesa PIN mobwerezabwereza. Yesaninso pambuyo pake.')}`;
    if (session.lastText === fullText && session.lastResponse) return session.lastResponse;

    const input = cleanInput(fullText.split('*').at(-1));
    const respond = async (response, ttl = sessionTtl) => {
      session.lastText = fullText;
      session.lastResponse = response;
      await store.set(sessionKey, session, { ex: ttl });
      return response;
    };

    if (session.step === 0) {
      if (!input) return respond('CON Welcome to MlimiConnect\nChoose language:\n1. English\n2. Chichewa');
      if (!['1', '2'].includes(input)) return respond('CON Invalid choice / Sankho silolondola. Choose / Sankhani:\n1. English\n2. Chichewa');
      session.language = input === '2' ? 'ny' : 'en';
      session.step = 1;
      return respond(`CON ${message(session, 'Enter your 4-digit PIN:', 'Lowetsani PIN yanu ya manambala 4:')}`);
    }

    if (session.step === 1) {
      if (!/^\d{4}$/.test(input)) return respond(`CON ${message(session, 'Invalid PIN format. Enter 4 digits:', 'PIN si yolondola. Lowetsani manambala 4:')}`);
      let authenticated = false;
      try { authenticated = await authenticate({ phone, pin: input, correlationId }); } catch { authenticated = false; }
      if (!authenticated) {
        session.attempts += 1;
        if (session.attempts >= maxAttempts) {
          const until = now() + lockoutSeconds * 1000;
          await store.set(lockKey, { until }, { ex: lockoutSeconds });
          return respond(`END ${message(session, 'Too many PIN attempts. Please try again later.', 'Mwayesa PIN mobwerezabwereza. Yesaninso pambuyo pake.')}`);
        }
        return respond(`CON ${message(session, `Incorrect PIN. ${maxAttempts - session.attempts} attempt(s) remaining:`, `PIN yolakwika. Mwayi ${maxAttempts - session.attempts} watsala:`)}`);
      }
      session.authenticated = true;
      session.step = 2;
      session.attempts = 0;
      return respond(`CON ${message(session, 'Welcome! Choose action:\n1. Market Prices\n2. Advisory\n3. My Orders\n4. Help', 'Mwalandiridwa! Sankhani:\n1. Mitengo ya Msika\n2. Upangiri\n3. Maoda Anga\n4. Thandizo')}`);
    }

    if (!session.authenticated) return respond(`END ${message(session, 'Your session expired. Please dial again.', 'Nthawi yanu yatha. Imbaninso.')}`);
    if (session.step === 2) {
      if(input==='1'){try{const data=await services.prices();const text=(data.items||[]).slice(0,3).map(row=>`${row.crop}: MWK ${row.price}/${row.unit}`).join('\n');return respond(`END ${text||message(session,'No prices available.','Palibe mitengo.')}`)}catch{return respond(`END ${message(session,'Price service is busy. Try again later.','Mitengo yatanganidwa. Yesaninso.')}`)}}
      if (input === '2') { session.step = 3; return respond(`CON ${message(session, 'Advisory Menu:\n1. Weather Forecast\n2. Pest & Disease Tips', 'Menu ya Upangiri:\n1. Nyengo\n2. Upangiri wa Tizirombo')}`); }
      if(input==='3'){try{const data=await services.orders(phone);const text=(data.items||[]).map(row=>`#${row.id}: ${row.status}`).join('\n');return respond(`END ${text||message(session,'No recent orders.','Palibe maoda aposachedwa.')}`)}catch{return respond('END Order service is busy. / Maoda atanganidwa.')}}
      if(input==='4'){try{const data=await services.support();return respond(`END Support: ${data.phone}\n${data.hours}`)}catch{return respond('END Support: support@mlimiconnect.mw')}}
      return respond(`CON ${message(session, 'Invalid choice. Choose:\n1. Market Prices\n2. Advisory\n3. My Orders\n4. Help', 'Sankho silolondola. Sankhani:\n1. Mitengo\n2. Upangiri\n3. Maoda\n4. Thandizo')}`);
    }
    if (session.step === 3 && input === '1') { session.step = 4; return respond(`CON ${message(session, 'Enter your district:', 'Lowetsani boma lanu:')}`); }
    if (session.step === 3 && input === '2') { session.step = 5; return respond(`CON ${message(session, 'Enter crop name:', 'Lowetsani dzina la mbewu:')}`); }
    if (session.step === 3) return respond(`CON ${message(session, 'Invalid choice. Choose 1 or 2:', 'Sankho silolondola. Sankhani 1 kapena 2:')}`);
    if(session.step===4){try{const data=await services.weather(input);return respond(`END ${data.district}: ${data.summary}\nSource: ${data.source}`)}catch{return respond(`END ${message(session,'Weather service is busy.','Nyengo yatanganidwa.')}`)}}
    if(session.step===5){try{const data=await services.pest(input);return respond(`END ${data.guidance}\n${message(session,'Not a diagnosis.','Si kupeza matenda kotsimikiza.')}`)}catch{return respond('END Advisory service is busy. / Upangiri watanganidwa.')}}
    return respond(`END ${message(session, 'Invalid session. Please dial again.', 'Nthawi si yolondola. Imbaninso.')}`);
  };
}

module.exports = { createUSSDHandler, normalizePhone };
