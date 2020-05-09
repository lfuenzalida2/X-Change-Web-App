const KoaRouter = require('koa-router');

const router = new KoaRouter();

router.get('explore.new', '/', async (ctx) => {
  await ctx.render('explore/explore', {
    object: await ctx.router.url('objects.list'),
  });
});


module.exports = router;
