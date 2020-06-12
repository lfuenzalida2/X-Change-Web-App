const KoaRouter = require('koa-router');

const router = new KoaRouter();

router.get('api.objects.list', '/:id', async (ctx) => {
  const { currentUser } = ctx.state;
  const categories = ctx.orm.category;
  const negotiations = ctx.orm.negotiation;
  const objectsList = await ctx.orm.object.findAll({
    where: { userId: currentUser.id },
    include: [{ model: categories }, { model: negotiations }],
  });
  ctx.body = ctx.jsonSerializer('object', {
    attributes: ['name', 'description', 'state', 'category', 'negotiations'],
  }).serialize(objectsList);
});

router.get('api.negotiation.get', '/negotiation/:id', async (ctx) => {
  const negotiation = await ctx.orm.negotiation.findByPk(ctx.params.id);
  ctx.body = ctx.jsonSerializer('negotiation', {
    attributes: ['customerId', 'sellerId', 'state'],
  }).serialize(negotiation);
});

router.del('api.object_del', '/:id/object', async (ctx) => {
  ctx.state.negotiation = await ctx.orm.negotiation.findByPk(ctx.params.id);
  const objectNegotiation = ctx.orm.objectNegotiation.build(ctx.request.body);
  await objectNegotiation.destroy();
  ctx.redirect(ctx.router.url('api.objects.list', { id: ctx.params.id }));
});

router.post('api.object_add', '/:id/object', async (ctx) => {
  const negotiation = await ctx.orm.negotiation.findByPk(ctx.params.id);
  const objectNegotiation = ctx.orm.objectNegotiation.build(ctx.request.body);
  try {
    await objectNegotiation.save({ fields: ['negotiationId', 'objectId'] });
    negotiation.changed('updatedAt', true);
    await negotiation.save();
    const respuesta = { status: 200, text: 'gucci la wea salió fina' };
    ctx.redirect(ctx.router.url('api.objects.list', { id: ctx.params.id }));
  } catch (err) {
    const respuesta = { status: 400, text: 'miegda la wea se ha caido' };
    ctx.body = ctx.jsonSerializer('respuesta', {
      attributes: ['status', 'text'],
    }).serialize(respuesta);
  }
});



module.exports = router;
