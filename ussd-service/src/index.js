require('dotenv').config();
const express = require('express');
const { createUSSDHandler } = require('./handlers');

function createApp({ store, authenticate } = {}) {
  const sessionStore = store ?? require('./redis');
  const handleUSSD = createUSSDHandler({ store: sessionStore, authenticate });
  const app = express();
  app.disable('x-powered-by');
  app.use(express.urlencoded({ extended: false, limit: '10kb' }));
  app.use(express.json({ limit: '10kb' }));
  app.get('/health', (_req, res) => res.status(200).json({ status: 'ok' }));
  app.get('/ready', async (_req, res) => {
    try { await sessionStore.ping(); res.status(200).json({ status: 'ready' }); }
    catch { res.status(503).json({ status: 'not_ready' }); }
  });
  app.post('/ussd', async (req, res) => {
    try {
      const response = await handleUSSD(req.body);
      res.status(200).type('text/plain').send(response);
    } catch (error) {
      console.error('USSD request failed:', error instanceof Error ? error.message : error);
      res.status(200).type('text/plain').send('END Service error. Please try again later. / Pepani, pali vuto. Yesaninso pambuyo pake.');
    }
  });
  return app;
}

if (require.main === module) {
  const port = Number.parseInt(process.env.PORT ?? '3000', 10);
  const app = createApp();
  const server = app.listen(Number.isInteger(port) && port > 0 ? port : 3000, () => console.log(`USSD service listening on port ${port}`));
  const shutdown = () => server.close(() => process.exit(0));
  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);
}

module.exports = { createApp };
