const KoaRouter = require('koa-router');

const router = new KoaRouter();

router.get('inventory.list', '/:id', async (ctx) => {
  const { currentUser } = ctx.state;
  const objectsList = await ctx.orm.object.findAll({ where: { userId: currentUser.id } });
  await ctx.render('inventory/index', {
    objectsList,
    objectView: (object) => ctx.router.url('objects.view', { id: object.id }),
  });
});


module.exports = router;
