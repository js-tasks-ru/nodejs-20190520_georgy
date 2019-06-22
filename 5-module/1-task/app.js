const Koa = require('koa');
const app = new Koa();

app.use(require('koa-static')('public'));
app.use(require('koa-bodyparser')());

const Router = require('koa-router');
const router = new Router();
const subscribers = [];
router.get('/subscribe', async (ctx, next) => {
  ctx.body = await new Promise((resolve) => {
    subscribers.push(resolve);
  });
});

router.post('/publish', async (ctx, next) => {
  const {message} = ctx.request.body;
  if (message) {
    subscribers.forEach((subscriber) => subscriber(message));
  }
  ctx.body = 'Ok';
});

app.use(router.routes());

module.exports = app;
