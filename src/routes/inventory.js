const KoaRouter = require('koa-router');

const router = new KoaRouter();

router.get('inventory.list', '/:id', async (ctx) => {
  const { currentUser } = ctx.state;
  const photos = await ctx.orm.photo;
  const categories = await ctx.orm.category;
  const objectsList = await ctx.orm.object.findAll(
    { where: { userId: currentUser.id }, include: [{ model: photos }, { model: categories }] },
  );
  await ctx.render('inventory/index', {
    objectsList,
    objectView: (object) => ctx.router.url('objects.view', { id: object.id }),
  });
});


module.exports = router;
