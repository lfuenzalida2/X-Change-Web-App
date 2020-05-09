const KoaRouter = require('koa-router');

const router = new KoaRouter();

router.get('/', async (ctx) => {
  await ctx.render('index', {
    register: ctx.router.url('users.new'),
  });
});

module.exports = router;
