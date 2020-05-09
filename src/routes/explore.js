const KoaRouter = require('koa-router');

const router = new KoaRouter();

router.get('explore.list', '/', async (ctx) => {
  const objectsList = await ctx.orm.object.findAll();
  await ctx.render('explore/explore_list_object', {
    objectsList,
    view: (object) => ctx.router.url('objects.view', { id: object.id }),
  });
});


module.exports = router;
