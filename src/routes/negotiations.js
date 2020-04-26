const KoaRouter = require('koa-router');

const router = new KoaRouter();

async function loadNegotiation(ctx, next) {
  ctx.state.negotiation = await ctx.orm.negotiation.findByPk(ctx.params.id);
  return next();
}

router.get('negotiations.list', '/', async (ctx) => {
  const negotiationsList = await ctx.orm.negotiation.findAll(); // Then find by logged user id
  await ctx.render('negotiations/index', {
    negotiationsList,
    createURL: ctx.router.url('negotiations.create'),
    showNegotiationPath: (negotiation) => ctx.router.url('negotiations.show', { id: negotiation.id }),
    deleteNegotiationPath: (negotiation) => ctx.router.url('negotiations.delete', { id: negotiation.id }),
  });
});

router.get('negotiations.show', '/:id', loadNegotiation, async (ctx) => {
  const { negotiation } = ctx.state;
  const messagesList = await ctx.orm.message.findAll({ where: { negotiation: negotiation.id } });
  await ctx.render('negotiations/show', {
    negotiation,
    editNegotiationPath: ctx.router.url('negotiations.update', { id: negotiation.id }),
    deleteNegotiationPath: ctx.router.url('negotiations.delete', { id: negotiation.id }),
    messagesList,
    newMessagePath: ctx.router.url('messages.create'),
    newReviewPath: ctx.router.url('reviews.new'),
    objects: await ctx.state.negotiation.getObjects(),
    addObjectPath: ctx.router.url('negotiations.add_object', { id: negotiation.id }),
  });
});

router.post('negotiations.create', '/', async (ctx) => {
  const customer = +ctx.request.body.customer;
  const seller = +ctx.request.body.seller;
  const { state } = ctx.request.body;
  const negotiation = ctx.orm.negotiation.build({ customer, seller, state });
  try {
    await negotiation.save({ fields: ['customer', 'seller', 'state'] });
    ctx.redirect(ctx.router.url('negotiations.list'));
  } catch (validationError) {
    await ctx.redirect(ctx.router.url('negotiations.list')); // Not displaying errors
  }
});

router.get('negotiations.add_object', '/:id/add_object', loadNegotiation, async (ctx) => {
  const { negotiation } = ctx.state;
  await ctx.render('negotiations/add_object', {
    negotiation,
    addObjectPath: ctx.router.url('negotiations.add', { id: negotiation.id }),
    goToNegotiation: ctx.router.url('negotiations.show', { id: negotiation.id }),
    objects: await ctx.state.negotiation.getObjects(),
  });
});

router.post('negotiations.add', '/:id', loadNegotiation, async (ctx) => {
  const { negotiation } = ctx.state;
  const objectNegotiation = ctx.orm.objectNegotiation.build(ctx.request.body);
  try {
    await objectNegotiation.save({ fields: ['negotiationId', 'objectId'] });
    ctx.redirect('back');
  } catch (validationError) {
    await ctx.render('negotiations/add_object', {
      objects: await ctx.state.negotiation.getObjects(),
      errors: validationError.errors,
      goToNegotiation: ctx.router.url('negotiations.show', { id: negotiation.id }),
      addObjectPath: ctx.router.url('negotiations.add', { id: negotiation.id }),
    });
  }
});

router.patch('negotiations.update', '/:id', loadNegotiation, async (ctx) => {
  const { negotiation } = ctx.state;
  try {
    const { customer, seller, state } = ctx.request.body;
    await negotiation.update({ customer, seller, state });
    ctx.redirect('back');
  } catch (validationError) {
    await ctx.redirect('back'); // Not displaying errors
  }
});

router.del('negotiations.delete', '/:id', loadNegotiation, async (ctx) => {
  const { negotiation } = ctx.state;
  await negotiation.destroy();
  ctx.redirect(ctx.router.url('negotiations.list'));
});

module.exports = router;
