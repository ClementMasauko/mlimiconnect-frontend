const { verifyPin } = require('./auth');

const SESSION_TTL = Number.parseInt(process.env.SESSION_TTL ?? '300', 10);
const MAX_PIN_ATTEMPTS = Number.parseInt(process.env.MAX_PIN_ATTEMPTS ?? '3', 10);
const LOCKOUT_SECONDS = Number.parseInt(process.env.PIN_LOCKOUT_SECONDS ?? '900', 10);

const message = (session, english, chichewa = english) => session.language === 'ny' ? chichewa : english;
const continuing = (text) => text.startsWith('CON ') ? text : `CON ${text}`;

function createUSSDHandler({ store, authenticate = verifyPin, now = () => Date.now() }) {
  if (!store) throw new Error('A session store is required');

  return async function handleUSSD({ sessionId, phoneNumber, text = '' }) {
    if (!sessionId || !phoneNumber) return 'END Invalid USSD request.';
    const phone = phoneNumber.startsWith('+265') ? phoneNumber : `+265${phoneNumber.replace(/^0/, '')}`;
    const session = (await store.get(sessionId)) ?? { step: 0, language: 'en', phone, authenticated: false, attempts: 0 };
    const input = text.split('*').at(-1)?.trim() ?? '';
    const save = async () => store.set(sessionId, session, { ex: SESSION_TTL });

    if (session.lockedUntil && session.lockedUntil > now()) {
      return `END ${message(session, 'Too many PIN attempts. Please try again later.', 'Mwayesa PIN mobwerezabwereza. Yesaninso pambuyo pake.')}`;
    }

    if (session.step === 0) {
      if (!input) return `CON ${message(session, 'Welcome to MlimiConnect\nChoose language:\n1. English\n2. Chichewa', 'Takulandirani ku MlimiConnect\nSankhani chiyankhulo:\n1. Chingerezi\n2. Chichewa')}`;
      if (input !== '1' && input !== '2') {
        await save();
        return `CON ${message(session, 'Invalid choice. Choose:\n1. English\n2. Chichewa', 'Sankho losavomerezeka. Sankhani:\n1. Chingerezi\n2. Chichewa')}`;
      }
      session.language = input === '2' ? 'ny' : 'en';
      session.step = 1;
      await save();
      return `CON ${message(session, 'Enter your 4-digit PIN:', 'Lowetsani PIN yanu ya manambala 4:')}`;
    }

    if (session.step === 1) {
      if (!/^\d{4}$/.test(input)) {
        await save();
        return `CON ${message(session, 'Invalid PIN. Enter your 4-digit PIN:', 'PIN yosavomerezeka. Lowetsani PIN yanu ya manambala 4:')}`;
      }
      const authenticated = await authenticate({ phone, pin: input });
      if (!authenticated) {
        session.attempts += 1;
        if (session.attempts >= MAX_PIN_ATTEMPTS) {
          session.lockedUntil = now() + LOCKOUT_SECONDS * 1000;
          await save();
          return `END ${message(session, 'Too many PIN attempts. Please try again later.', 'Mwayesa PIN mobwerezabwereza. Yesaninso pambuyo pake.')}`;
        }
        await save();
        return `CON ${message(session, 'Incorrect PIN. Try again:', 'PIN yolakwika. Yesaninso:')}`;
      }
      session.authenticated = true;
      session.step = 2;
      session.attempts = 0;
      await save();
      return `CON ${message(session, 'Welcome! Choose action:\n1. Market Prices\n2. Advisory\n3. My Orders\n4. Help', 'Mwalandiridwa! Sankhani chinthu:\n1. Mitengo ya Msika\n2. Upangiri\n3. Maoda Anga\n4. Thandizo')}`;
    }

    if (!session.authenticated) return 'END Your session has expired. Please dial again.';
    if (session.step === 2) {
      if (input === '1') return `END ${message(session, 'Current Prices:\nMaize: MWK 42,000/50kg\nTomatoes: MWK 15,000/10kg\nGroundnuts: MWK 58,000/50kg')}`;
      if (input === '2') { session.step = 3; await save(); return `CON ${message(session, 'Advisory Menu:\n1. Weather Forecast\n2. Pest & Disease Tips', 'Menu ya Upangiri:\n1. Nyengo\n2. Upangiri wa Tizirombo')}`; }
      if (input === '3') return `END ${message(session, 'Your Orders are available in the MlimiConnect app.', 'Maoda anu akupezeka pa pulogalamu ya MlimiConnect.')}`;
      if (input === '4') return `END ${message(session, 'Help: Dial *1399# anytime.', 'Thandizo: Imbani *1399# nthawi iliyonse.')}`;
      return `CON ${message(session, 'Invalid choice. Choose:\n1. Market Prices\n2. Advisory\n3. My Orders\n4. Help')}`;
    }
    if (session.step === 3 && input === '1') { session.step = 4; await save(); return `CON ${message(session, 'Enter your location (e.g. Lilongwe):', 'Lowetsani malo anu (mwachitsanzo Lilongwe):')}`; }
    if (session.step === 3 && input === '2') { session.step = 5; await save(); return `CON ${message(session, 'Enter crop name (e.g. maize):', 'Lowetsani dzina la mbewu (mwachitsanzo maize):')}`; }
    if (session.step === 4) return `END ${message(session, `Weather for ${input}: advisory data is not yet configured.`)}`;
    if (session.step === 5) return `END ${message(session, `Pest advice for ${input}: advisory data is not yet configured.`)}`;
    return continuing(message(session, 'Invalid choice. Please dial again.'));
  };
}

module.exports = { createUSSDHandler };
