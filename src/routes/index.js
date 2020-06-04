const KoaRouter = require('koa-router');

const router = new KoaRouter();

router.get('/', async (ctx) => {
  const photos = await ctx.orm.photo;
  const mostViewed = await ctx.orm.object.findAll({
    limit: 10, order: [['views', 'DESC']], include: [{ model: photos }],
  });
  await ctx.render('index', {
    register: ctx.router.url('users.new'),
    mostViewed,
    showObjectPath: (object) => ctx.router.url('objects.view', { id: object.id }),
  });
});

module.exports = router;
