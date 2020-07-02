const KoaRouter = require('koa-router');
const Fuse = require('fuse.js');

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
  let keywords;
  if (search.keywords === '') {
    keywords = ' ';
  } else {
    keywords = search.keywords;
  }
  const users = await ctx.orm.user;
  const categoryList = await ctx.orm.category.findAll();
  const includeStatement = search.region !== 'todas' ? [{ model: users, where: { region: search.region } }] : [{ model: users }];
  const whereStatement = search.categoryId !== 'todas' ? { categoryId: search.categoryId, state: search.state } : { state: search.state };
  const objectsList = await ctx.orm.object.findAll(
    {
      where: whereStatement,
      include: includeStatement,
    },
  );
  const fuse = new Fuse(objectsList, options);
  const result = fuse.search(keywords);
  await ctx.render('explore/explore_list_object', {
    result,
    categoryList,
    objectsList,
    view: (object) => ctx.router.url('objects.view', { id: object.id }),
    submitSearchPath: ctx.router.url('objects.search'),
  });
});

module.exports = router;
