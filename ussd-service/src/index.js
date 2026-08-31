require('dotenv').config();
const express = require('express');
const { randomUUID } = require('crypto');
const { createUSSDHandler } = require('./handlers');
const {createServices}=require('./services');

function createApp({ store, authenticate } = {}) {
  const sessionStore = store ?? require('./redis');
  const handleUSSD = createUSSDHandler({ store: sessionStore, authenticate,services:createServices() });
  const app = express();
  app.disable('x-powered-by');
  app.use(express.urlencoded({ extended: false, limit: '10kb' }));
  app.use(express.json({ limit: '10kb' }));
  const allowed=new Set((process.env.USSD_ALLOWED_IPS||'127.0.0.1,::1').split(',').map(x=>x.trim()).filter(Boolean)),hits=new Map();app.set('trust proxy',1);app.use('/ussd',(req,res,next)=>{const ip=req.ip.replace(/^::ffff:/,'');if(allowed.size&&!allowed.has(ip))return res.status(403).send('Forbidden');const minute=Math.floor(Date.now()/60000),id=`${ip}:${minute}`,count=(hits.get(id)||0)+1;hits.set(id,count);if(count>Number(process.env.USSD_RATE_LIMIT_PER_MINUTE||60))return res.status(429).send('Rate limited');next()});
  app.get('/health', (_req, res) => res.status(200).json({ status: 'ok' }));
  app.get('/ready', async (_req, res) => {
    try { await sessionStore.ping(); res.status(200).json({ status: 'ready' }); }
    catch { res.status(503).json({ status: 'not_ready' }); }
  });
  app.get('/metrics',(_req,res)=>res.type('text/plain').send(`ussd_store_mode{mode="${sessionStore.mode?.()||'custom'}"} 1\n`));
  app.post('/ussd', async (req, res) => {
    const correlationId = String(req.get('X-Correlation-ID') || randomUUID()).slice(0, 64);
    res.set('X-Correlation-ID', correlationId);
    try {
      const started = Date.now();
      const response = await handleUSSD({ ...req.body, correlationId });
      console.log(JSON.stringify({ level:'info', event:'ussd.completed', correlationId, durationMs:Date.now()-started, result:String(response).startsWith('END')?'ended':'continued' }));
      res.status(200).type('text/plain').send(response);
    } catch (error) {
      console.error(JSON.stringify({ level:'error', event:'ussd.failed', correlationId, message:error instanceof Error ? error.message : 'unknown error' }));
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
