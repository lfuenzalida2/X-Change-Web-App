const KoaRouter = require('koa-router');

const index = require('./routes/index');
const explore = require('./routes/explore');
const negotiations = require('./routes/negotiations');
const messages = require('./routes/messages');
const reviews = require('./routes/reviews');
const categories = require('./routes/categories');
const objects = require('./routes/objects');
const users = require('./routes/users');
const session = require('./routes/session');
const inventory = require('./routes/inventory');

const router = new KoaRouter();

router.use(async (ctx, next) => {
  let currentSession;
  if (ctx.session.sessionToken) {
    currentSession = await ctx.orm.session.findOne(
      { where: { token: ctx.session.sessionToken } },
    );
  }
  Object.assign(ctx.state, {
    currentUser: currentSession && await currentSession.getUser(),
    newSessionPath: ctx.router.url('session.new'),
    destroySessionPath: ctx.router.url('session.destroy'),
    negotiationsPath: ctx.router.url('negotiations.list'),
    explore: ctx.router.url('explore.list'),
    inventory: (user) => ctx.router.url('inventory.list', { id: user.id }),
    profile: (user) => ctx.router.url('users.index', { id: user.id }),
    registerSession: ctx.router.url('users.new'),
    negotiations: ctx.router.url('negotiations.list'),
  });
  return next();
});

router.use('/negotiations', async (ctx, next) => {
  if (!ctx.state.currentUser) {
    ctx.redirect('/session/new');
    return;
  }
  await next(); // go to next middleware
});

router.use('/', index.routes());
router.use('/explore', explore.routes());
router.use('/inventory', inventory.routes());
router.use('/categories', categories.routes());
router.use('/objects', objects.routes());
router.use('/users', users.routes());
router.use('/negotiations', negotiations.routes());
router.use('/messages', messages.routes());
router.use('/reviews', reviews.routes());
router.use('/session', session.routes());

module.exports = router;
