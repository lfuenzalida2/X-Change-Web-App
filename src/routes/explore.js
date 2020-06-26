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
  const users = await ctx.orm.user;
  const categoryList = await ctx.orm.category.findAll();
  const objectsList = await ctx.orm.object.findAll({
    include: [{ model: users }],
  });
  const fuse = new Fuse(objectsList, options);
  const result = fuse.search(' ');
  try {
    await ctx.render('explore/explore_list_object', {
      result,
      categoryList,
      view: (object) => ctx.router.url('objects.view', { id: object.id }),
      submitSearchPath: ctx.router.url('objects.search'),
    });
  } catch (err) {
    await ctx.render('explore/explore_list_object', {
      result,
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
