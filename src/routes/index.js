const KoaRouter = require('koa-router');

const router = new KoaRouter();

router.get('/', async (ctx) => {
  const photos = await ctx.orm.photo;
  const mostViewed = await ctx.orm.object.findAll({
    limit: 10, order: [['views', 'DESC']], include: [{ model: photos }],
  });
  const categoriesList = await ctx.orm.category.findAll();
  await ctx.render('index', {
    register: ctx.router.url('users.new'),
    categoriesList,
    showCategoryPath: (category) => ctx.router.url('categories.show', { id: category.id }),
    mostViewed,
    showObjectPath: (object) => ctx.router.url('objects.view', { id: object.id }),
  });
});

module.exports = router;
