const KoaRouter = require('koa-router');
const { Op } = require('sequelize');

const router = new KoaRouter();

router.get('explore.list', '/', async (ctx) => {
  const currentUser = await ctx.state.currentUser;
  try {
    const objectsList = await ctx.orm.object.findAll({
      where: { userId: { [Op.not]: currentUser.id } } });
    await ctx.render('explore/explore_list_object', {
      objectsList,
      view: (object) => ctx.router.url('objects.view', { id: object.id }),
    });
  } catch {
    const objectsList = await ctx.orm.object.findAll();
    await ctx.render('explore/explore_list_object', {
      objectsList,
      view: (object) => ctx.router.url('objects.view', { id: object.id }),
    });
  }
});


module.exports = router;
