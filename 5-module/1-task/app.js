const Koa = require('koa');
const app = new Koa();

app.use(require('koa-static')('public'));
app.use(require('koa-bodyparser')());

const Router = require('koa-router');
const router = new Router();
const messages = [];


router.get('/subscribe', async (ctx, next) => {
  console.log('/subscribe');
  return await next();
});

router.post('/publish', async (ctx, next) => {
  console.log('/publish');
  messages.push(ctx.request.body.message);
  ctx.res.end(Buffer.from(messages));
  return next();
});

app.use(router.routes());

module.exports = app;
