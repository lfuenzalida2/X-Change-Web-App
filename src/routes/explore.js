const KoaRouter = require('koa-router');
const { Op } = require('sequelize');

const router = new KoaRouter();

router.get('explore.list', '/', async (ctx) => {
  const currentUser = await ctx.state.currentUser;
  const { user, category } = ctx.orm;
  try {
    const objectsList = await ctx.orm.object.findAll({
      where: { userId: { [Op.not]: currentUser.id } },
      include: [{ model: category }, { model: user }],
    });
    await ctx.render('explore/explore_list_object', {
      objectsList,
      view: (object) => ctx.router.url('objects.view', { id: object.id }),
    });
  } catch (err) {
    const objectsList = await ctx.orm.object.findAll();
    await ctx.render('explore/explore_list_object', {
      objectsList,
      view: (object) => ctx.router.url('objects.view', { id: object.id }),
    });
  }
});


module.exports = router;
