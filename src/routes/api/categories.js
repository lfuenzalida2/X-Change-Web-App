const KoaRouter = require('koa-router');

const router = new KoaRouter();

router.get('api.categories.list', '/', async (ctx) => {
  const categoriesList = await ctx.orm.category.findAll();
  ctx.body = ctx.jsonSerializer('category', {
    pluralizeType: false,
    attributes: ['name'],
    keyForAttribute: 'camelCase',
    topLevelLinks: {
      self: `${ctx.origin}${ctx.router.url('api.categories.list')}`,
    },
  }).serialize(categoriesList);
});

module.exports = router;
