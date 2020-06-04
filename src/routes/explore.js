const KoaRouter = require('koa-router');
const Fuse = require('fuse.js');
const { Op } = require('sequelize');

const router = new KoaRouter();

const options = {
  includeScore: true,
  shouldSort: true,
  includeMatches: true,
  // Search in `name` and in 'description'
  keys: ['dataValues.name', 'dataValues.description'],
};

router.get('explore.list', '/', async (ctx) => {
  const currentUser = await ctx.state.currentUser;
  const objectsList = await ctx.orm.object.findAll();
  const categoryList = await ctx.orm.category.findAll();
  const fuse = new Fuse(objectsList, options);
  const result = fuse.search('');
  const { user, category } = ctx.orm;
  try {
    const objectsList = await ctx.orm.object.findAll({
      where: { userId: { [Op.not]: currentUser.id } },
      include: [{ model: category }, { model: user }],
    });
    await ctx.render('explore/explore_list_object', {
      result,
      categoryList,
      objectsList,
      view: (object) => ctx.router.url('objects.view', { id: object.id }),
      submitSearchPath: ctx.router.url('objects.search'),
    });
  } catch (err) {
    const objectsList = await ctx.orm.object.findAll();
    await ctx.render('explore/explore_list_object', {
      result,
      objectsList,
      categoryList,
      view: (object) => ctx.router.url('objects.view', { id: object.id }),
      submitSearchPath: ctx.router.url('objects.search'),
    });
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
  }
  const fuse = new Fuse(objectsList, options);
  const result = fuse.search(search.keywords);
  await ctx.render('explore/explore_list_object', {
    result,
    categoryList,
    objectsList,
    view: (object) => ctx.router.url('objects.view', { id: object.id }),
    submitSearchPath: ctx.router.url('objects.search'),
  });
});

module.exports = router;
