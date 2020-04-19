const KoaRouter = require('koa-router');

const router = new KoaRouter();

router.get('exchanges.list', '/', async (ctx) => {
  const exchangesList = await ctx.orm.negotiation.findAll({
    include: [{
      model: models.objects,
      required: false,

      attributes: ['id', 'name'],
      through: {
        model: 'objectNegotiations',
      },
    }],
  });
  await ctx.render('exchanges/index', {
    exchangesList,
  });
});

module.exports = router;
