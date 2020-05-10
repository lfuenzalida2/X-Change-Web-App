const KoaRouter = require('koa-router');
<<<<<<< HEAD
const { Op } = require('sequelize');
=======
>>>>>>> c12511cef8f951269568dfd70e95d568b0045ebc

const router = new KoaRouter();

router.get('explore.list', '/', async (ctx) => {
<<<<<<< HEAD
  const currentUser = await ctx.state.currentUser;
  const objectsList = await ctx.orm.object.findAll({
    where: { userId: { [Op.not]: currentUser.id } } });
=======
  const objectsList = await ctx.orm.object.findAll();
>>>>>>> c12511cef8f951269568dfd70e95d568b0045ebc
  await ctx.render('explore/explore_list_object', {
    objectsList,
    view: (object) => ctx.router.url('objects.view', { id: object.id }),
  });
});


module.exports = router;
