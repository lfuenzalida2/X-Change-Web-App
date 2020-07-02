const KoaRouter = require('koa-router');
const jwt = require('koa-jwt');
const authApi = require('./auth');
const notificationsApi = require('./notifications');
const negotiationsApi = require('./negotiations');
const objectsApi = require('./objects');
const categoriesApi = require('./categories');

const router = new KoaRouter();

// unauthenticated endpoints
router.use('/auth', authApi.routes());
router.use('/categories', categoriesApi.routes());

// JWT authentication without passthrough (error if not authenticated)
router.use(jwt({ secret: process.env.JWT_SECRET, key: 'authData' }));
router.use(async (ctx, next) => {
  if (ctx.state.authData.userId) {
    ctx.state.currentUser = await ctx.orm.user.findByPk(ctx.state.authData.userId);
  }
  return next();
});

router.use('/notifications', notificationsApi.routes());
router.use('/negotiations', negotiationsApi.routes());
router.use('/objects', objectsApi.routes());

module.exports = router;
