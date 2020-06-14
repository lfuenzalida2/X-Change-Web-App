const KoaRouter = require('koa-router');
const { Op } = require('sequelize');
const sendNegotiationEmail = require('../mailers/new_negotiation');

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
  await ctx.render('negotiations/index');
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
  const user = await ctx.orm.user.findByPk(customerId);
  const negotiation = ctx.orm.negotiation.build({ customerId, sellerId, state });
  try {
    await negotiation.save({ fields: ['customerId', 'sellerId', 'state'] });
    const notification = ctx.orm.notification.build(
      { userId: customerId, negotiationId: negotiation.id, type: 'newNegotiation' },
    );
    await notification.save({ fields: ['userId', 'negotiationId', 'type'] });
    await sendNegotiationEmail(ctx, { user });
    ctx.body = {
      customerId,
      negotiationId: negotiation.id,
      redirect: ctx.router.url('negotiations.show', { id: negotiation.id }),
    };
  } catch (validationError) {
    await ctx.redirect('back'); // Not displaying errors
  }
});

router.patch('negotiations.update', '/:id', loadNegotiation, async (ctx) => {
  const { negotiation, currentUser } = ctx.state;
  const { state } = ctx.request.body;
  const iAm = (currentUser.id === negotiation.customerId) ? 'Customer' : 'Seller';
  if (negotiation.state === 'In Progress') {
    negotiation.state = iAm;
  } else if (negotiation.state === 'Customer' && iAm === 'Seller') {
    negotiation.state = 'Accepted';
  } else if (negotiation.state === 'Seller' && iAm === 'Customer') {
    negotiation.state = 'Accepted';
  } else if (negotiation.state !== 'Accepted') {
    negotiation.state = state;
  }
  if (negotiation.state === 'Accepted') {
    const objectNegotiation = await ctx.orm.objectNegotiation.findAll({
      where: { negotiationId: negotiation.id },
    });
    objectNegotiation.forEach(async (object) => {
      const element = await ctx.orm.object.findByPk(object.objectId);
      await element.update({ state: false });
    });
  }
  try {
    await negotiation.update({ state: negotiation.state });
    ctx.redirect('back');
  } catch (validationError) {
    await ctx.redirect('back'); // Not displaying errors
  }
});

// Negotiation delete
router.del('negotiations.delete', '/:id', loadNegotiation, async (ctx) => {
  const { negotiation } = ctx.state;
  await negotiation.destroy();
  ctx.redirect(ctx.router.url('negotiations.list'));
});

// Object in negotiation delete
router.del('negotiations.object_del', '/:id/object', async (ctx) => {
  ctx.state.negotiation = await ctx.orm.negotiation.findByPk(ctx.params.id);
  const objectNegotiation = ctx.orm.objectNegotiation.build(ctx.request.body);
  await objectNegotiation.destroy();
  await ctx.redirect('back');
});

module.exports = router;
