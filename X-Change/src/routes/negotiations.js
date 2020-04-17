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

router.patch('negotiations.update', '/:id', loadNegotiation, async (ctx) => {
  const { negotiation } = ctx.state;
  try {
    const { customer, seller, state } = ctx.request.body;
    await negotiation.update({ customer, seller, state });
    ctx.redirect(ctx.router.url('negotiations.list'));
  } catch (validationError) {
    await ctx.render('negotiations/index', {
      errors: validationError.errors, // Not displaying errors
    });
  }
});

router.del('negotiations.delete', '/:id', loadNegotiation, async (ctx) => {
  const { negotiation } = ctx.state;
  await negotiation.destroy();
  ctx.redirect(ctx.router.url('negotiations.list'));
});

module.exports = router;
