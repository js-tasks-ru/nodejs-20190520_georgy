const Koa = require('koa');
const Router = require('koa-router');
const User = require('./models/User');
const app = new Koa();
const mongoose = require('mongoose');

app.use(require('koa-static')('public'));
app.use(require('koa-bodyparser')());

app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    if (err.status) {
      ctx.status = err.status;
      ctx.body = {error: err.message};
    } else {
      ctx.status = 500;
      ctx.body = {error: 'Internal server error'};
    }
  }
});

const router = new Router();

router.get('/users', async (ctx, next) => {
  ctx.body = await User.find({});
});

router.get('/users/:id', async (ctx) => {
  const {id} = ctx.params;
  if (mongoose.Types.ObjectId.isValid(id)) {
    const user = await User.findOne({_id: id});
    if (user) {
      ctx.body = user;
    } else {
      ctx.status = 404;
    }
  } else {
    ctx.status = 400;
  }
});

router.patch('/users/:id', async (ctx) => {
  const {id} = ctx.params;
  if (mongoose.Types.ObjectId.isValid(id)) {
    const {email, displayName} = ctx.request.body;
    try {
      const user = await User.findOne({_id: id});
      if (email) {
        user.email = email;
      }
      if (displayName) {
        user.displayName = displayName;
      }
      ctx.body = await user.save();
    } catch (e) {
      ctx.status = 400;
      ctx.body = {errors: createValidationErrors(e.errors)};
    }
  } else {
    ctx.status = 400;
  }
});

router.post('/users', async (ctx) => {
  const {email, displayName} = await ctx.request.body;
  try {
    ctx.body = await User.create({email: email, displayName: displayName});
  } catch ({errors}) {
    const validationErrors = createValidationErrors(errors);
    ctx.status = 400;
    ctx.body = {errors: validationErrors};
  }
});

router.delete('/users/:id', async (ctx) => {
  try {
    const {id} = ctx.params;
    const {deletedCount} = await User.deleteOne({_id: id});
    if (deletedCount === 0) {
      ctx.status = 404;
    } else {
      ctx.status = 200;
    }
  } catch (e) {
    ctx.status = 500;
  }
});

const createValidationErrors = (errors) => {
  const validationErrors = {};
  // eslint-disable-next-line guard-for-in
  for (const key in errors) {
    validationErrors[key] = errors[key].message;
  }
  return validationErrors;
}

app.use(router.routes());

module.exports = app;
