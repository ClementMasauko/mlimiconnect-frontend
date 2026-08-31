const axios = require('axios');

async function verifyPin({ phone, pin, correlationId }) {
  const baseURL = process.env.AUTH_API_URL;
  const serviceKey = process.env.USSD_SERVICE_KEY;
  if (!baseURL || !serviceKey) {
    console.error('AUTH_API_URL or USSD_SERVICE_KEY is not configured; refusing USSD authentication.');
    return false;
  }
  try {
    const timeout = Number.parseInt(process.env.AUTH_TIMEOUT_MS ?? '5000', 10);
    const { data } = await axios.post(`${baseURL.replace(/\/$/, '')}/api/ussd/authenticate`, { phone, pin }, { timeout: Number.isInteger(timeout) && timeout > 0 ? timeout : 5000, headers: { 'X-USSD-Service-Key': serviceKey, 'X-Correlation-ID': correlationId } });
    return data?.authenticated === true;
  } catch (error) {
    console.error('USSD authentication request failed:', error.message);
    return false;
  }
}

module.exports = { verifyPin };
