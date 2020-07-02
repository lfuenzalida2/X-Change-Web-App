const KoaRouter = require('koa-router');
const Fuse = require('fuse.js');
const axios = require('axios');
const translatorConfig = require('../config/translator');

const router = new KoaRouter();

const options = {
  includeScore: true,
  shouldSort: true,
  includeMatches: true,
  thereshold: 0.1,
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
  const promises = [];
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
  
  if (objectsList.length && search.language !== 'es') {
    for (let i = 0; i < objectsList.length; i++) {
      promises.push(
        axios({
          method: 'GET',
          url: 'https://systran-systran-platform-for-language-processing-v1.p.rapidapi.com/translation/text/translate',
          headers: translatorConfig,
          params: {
            source: 'es',
            target: search.language,
            input: `${objectsList[i].dataValues.name}|||${objectsList[i].dataValues.description}`,
          },
        }).then((response) => {
          const res = response.data.outputs[0].output;
          objectsList[i].dataValues.name = res.slice(0, res.indexOf('|||'));
          objectsList[i].dataValues.description = res.slice(res.indexOf('|||') + 3, res.length);
        }),
      );
    }
    await Promise.all(promises);
  }
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
