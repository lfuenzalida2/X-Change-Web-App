const KoaRouter = require('koa-router');

const router = new KoaRouter();

async function loadNegotiation(ctx, next) {
  ctx.state.negotiation = await ctx.orm.negotiation.findByPk(ctx.params.id);
  return next();
}

function currentRole(ctx, customer, seller) {
  const { currentUser } = ctx.state;
  if (currentUser.id === customer.id) {
    return customer;
  } if (currentUser.id === seller.id) {
    return seller;
  }
  return null;
}
function otherRole(ctx, customer, seller) {
  const { currentUser } = ctx.state;
  if (currentUser.id === customer.id) {
    return seller;
  }
  return customer;
}
function didReview(ctx, reviews) {
  const { currentUser } = ctx.state;
  for (let i = 0; i < reviews.length; i += 1) {
    if (reviews[i].id === currentUser.id) {
      return true;
    }
  }
  return false;
}

function sortByDateDesc(a, b) {
  return -(new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime());
}

router.get('negotiations.list', '/', async (ctx) => {
  const negotiationsStarted = await ctx.state.currentUser.getNegotiationsStarted();
  const negotiationsGotten = await ctx.state.currentUser.getNegotiationsGotten();
  const negotiationsList = negotiationsStarted.concat(negotiationsGotten).sort(sortByDateDesc);
  /* ver include https://sequelize.org/master/manual/eager-loading.html */
  for (let i = 0; i < negotiationsList.length; i++) {
    const element = negotiationsList[i];
    const customer = await element.getCustomer();
    const seller = await element.getSeller();
    element.customer = customer;
    element.seller = seller;
  }
  await ctx.render('negotiations/index', {
    negotiationsList,
    showNegotiationPath: (negotiation) => ctx.router.url('negotiations.show', { id: negotiation.id }),
    deleteNegotiationPath: (negotiation) => ctx.router.url('negotiations.delete', { id: negotiation.id }),
  });
});

router.get('negotiations.show', '/:id', loadNegotiation, async (ctx) => {
  const { negotiation } = ctx.state;
  const customer = await negotiation.getCustomer();
  const seller = await negotiation.getSeller();
  const reviews = await negotiation.getReviews();
  await ctx.render('negotiations/show', {
    negotiation,
    customer,
    seller,
    editNegotiationPath: ctx.router.url('negotiations.update', { id: negotiation.id }),
    deleteNegotiationPath: ctx.router.url('negotiations.delete', { id: negotiation.id }),
    messagesList: await negotiation.getMessages(),
    newMessagePath: ctx.router.url('messages.create'),
    newReviewPath: ctx.router.url('reviews.new'),
    currentReview: didReview(ctx, reviews),
    objects: await ctx.state.negotiation.getObjects(),
    addObjectPath: ctx.router.url('negotiations.add_object', { id: negotiation.id }),
    currentRole: currentRole(ctx, customer, seller),
    otherRole: otherRole(ctx, customer, seller),
  });
});

router.post('negotiations.create', '/', async (ctx) => {
  const customerId = +ctx.request.body.customerId;
  const sellerId = +ctx.request.body.sellerId;
  const { state } = ctx.request.body;
  const negotiation = ctx.orm.negotiation.build({ customerId, sellerId, state });
  try {
    await negotiation.save({ fields: ['customerId', 'sellerId', 'state'] });
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
    negotiation.changed('updatedAt', true);
    await negotiation.save();
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
    const { customerId, sellerId, state } = ctx.request.body;
    await negotiation.update({ customerId, sellerId, state });
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
