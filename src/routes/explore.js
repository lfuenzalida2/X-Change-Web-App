const KoaRouter = require('koa-router');
const { Op } = require('sequelize');

const router = new KoaRouter();

router.get('explore.list', '/', async (ctx) => {
<<<<<<< Updated upstream
=======
  const objectsList = await ctx.orm.object.findAll();
  const categoryList = await ctx.orm.category.findAll();
  const fuse = new Fuse(objectsList, options);
  const result = fuse.search('');
  await ctx.render('explore/explore_list_object', {
    result,
    categoryList,
    view: (object) => ctx.router.url('objects.view', { id: object.id }),
    submitSearchPath: ctx.router.url('objects.search'),
  });
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
=======
  }
});

router.post('objects.search', '/', async (ctx) => {
  const search = ctx.request.body;
  const users = await ctx.orm.user;
  const categoryList = await ctx.orm.category.findAll();
  let objectsList = null;
  if (search.region === 'todas' && search.categoryId === 'todas') {
    objectsList = await ctx.orm.object.findAll(
      {
        where: { state: search.state },
        include: [{ model: users }],
      },
    );
  } else if (search.region === 'todas' && search.categoryId !== 'todas') {
    objectsList = await ctx.orm.object.findAll(
      {
        where: { categoryId: search.categoryId, state: search.state },
        include: [{ model: users }],
      },
    );
  } else if (search.region !== 'todas' && search.categoryId === 'todas') {
    objectsList = await ctx.orm.object.findAll(
      {
        where: { state: search.state },
        include: [{ model: users, where: { region: search.region } }],
      },
    );
  } else {
    objectsList = await ctx.orm.object.findAll(
      {
        where: { categoryId: search.categoryId, state: search.state },
        include: [{ model: users, where: { region: search.region } }],
      },
    );
>>>>>>> Stashed changes
  }
});


module.exports = router;
