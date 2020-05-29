const KoaRouter = require('koa-router');
const { Op } = require('sequelize');

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
    if (reviews[i].reviewedId === currentUser.id || reviews[i].reviewerId === currentUser.id) {
      return true;
    }
  }
  return false;
}

function sortByDateDesc(a, b) {
  return -(new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime());
}

router.get('negotiations.list', '/', async (ctx) => {
  const users = await ctx.orm.user;
  const currentUser = await ctx.state.currentUser;
  const negotiationsList = await ctx.orm.negotiation.findAll({
    where: {
      [Op.or]: [{ sellerId: { [Op.eq]: currentUser.id } },
        { customerId: { [Op.eq]: currentUser.id } }],
    },
    include: [{ model: users, as: 'customer' }, { model: users, as: 'seller' }],
  });
  negotiationsList.sort(sortByDateDesc);
  await ctx.render('negotiations/index', {
    negotiationsList,
    showNegotiationPath: (negotiation) => ctx.router.url('negotiations.show', { id: negotiation.id }),
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
    reviews,
    deleteObject: ctx.router.url('negotiations.object_del', { id: negotiation.id }),
    editNegotiationPath: ctx.router.url('negotiations.update', { id: negotiation.id }),
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
    const notification = ctx.orm.notification.build(
      { userId: customerId, negotiationId: negotiation.id, type: 'newNegotiation' },
    );
    await notification.save({ fields: ['userId', 'negotiationId', 'type'] });
    ctx.body = {
      customerId,
      negotiationId: negotiation.id,
      redirect: ctx.router.url('negotiations.show', { id: negotiation.id }),
    };
  } catch (validationError) {
    await ctx.redirect('back'); // Not displaying errors
  }
});

router.get('negotiations.add_object', '/:id/add_object', loadNegotiation, async (ctx) => {
  const { negotiation } = ctx.state;
  const categories = ctx.orm.category;
  const currentUser = await ctx.state.currentUser;
  const objectList = await ctx.orm.object.findAll({
    where: { userId: currentUser.id },
    include: { model: categories },
  });
  await ctx.render('negotiations/add_object', {
    negotiation,
    objectList,
    deleteObject: ctx.router.url('negotiations.object_del', { id: negotiation.id }),
    addObjectPath: ctx.router.url('negotiations.add', { id: negotiation.id }),
    goToNegotiation: ctx.router.url('negotiations.show', { id: negotiation.id }),
    objects: await ctx.state.negotiation.getObjects(),
  });
});

router.post('negotiations.add', '/:id', loadNegotiation, async (ctx) => {
  const { negotiation } = ctx.state;
  const categories = ctx.orm.category;
  const currentUser = await ctx.state.currentUser;
  const objectList = await ctx.orm.object.findAll({
    where: { userId: currentUser.id },
    include: { model: categories },
  });
  const objectNegotiation = ctx.orm.objectNegotiation.build(ctx.request.body);
  try {
    await objectNegotiation.save({ fields: ['negotiationId', 'objectId'] });
    negotiation.changed('updatedAt', true);
    await negotiation.save();
    ctx.router.url('negotiations.add_object');
  } catch (validationError) {
    await ctx.render('negotiations/add_object', {
      objectList,
      deleteObject: ctx.router.url('negotiations.object_del', { id: negotiation.id }),
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


router.del('negotiations.object_del', '/:id/object', loadNegotiation, async (ctx) => {
  const objectNegotiation = ctx.orm.objectNegotiation.build(ctx.request.body);
  await objectNegotiation.destroy();
  await ctx.redirect('back');
});

module.exports = router;
