const axios = require('axios');

async function verifyPin({ phone, pin }) {
  const baseURL = process.env.AUTH_API_URL;
  if (!baseURL) {
    console.error('AUTH_API_URL is not configured; refusing USSD authentication.');
    return false;
  }
  try {
    const { data } = await axios.post(`${baseURL.replace(/\/$/, '')}/api/ussd/authenticate`, { phone, pin }, { timeout: 5000 });
    return data?.authenticated === true;
  } catch (error) {
    console.error('USSD authentication request failed:', error.message);
    return false;
  }
}

module.exports = { verifyPin };
