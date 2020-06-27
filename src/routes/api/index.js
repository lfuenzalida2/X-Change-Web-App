const KoaRouter = require('koa-router');
const { Op } = require('sequelize');
const fileStorage = require('../../services/file-storage');

const router = new KoaRouter();

function sortByDateDesc(a, b) {
  return -(new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime());
}

router.post('api.upload', '/upload', async (ctx) => {
  console.log('AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA');
  const { file } = ctx.request.files;
  // const currentUser = await ctx.state.currentUser;
  // const profilePicture = list.name;
  // await currentUser.update({ profilePicture });
  await fileStorage.upload(file);
  ctx.status = 200;
});

router.get('api.negotiation.get.negotiations', '/negotiations', async (ctx) => {
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
  ctx.body = ctx.jsonSerializer('negotiation', {
    attributes: ['state', 'customer', 'seller'],
  }).serialize(negotiationsList);
});

router.get('api.current.user', '/current_user', async (ctx) => {
  const currentUser = await ctx.state.currentUser;
  ctx.body = ctx.jsonSerializer('currentUser', {
    attributes: ['id', 'username'],
  }).serialize(currentUser);
});

router.get('api.negotiation.review', '/review/:id/:rid/:red', async (ctx) => {
  const { id, rid, red } = ctx.params;
  const review = await ctx.orm.review.findOne({
    where: { negotiationId: id, reviewerId: rid, reviewedId: red },
  });
  ctx.body = ctx.jsonSerializer('review', {
    attributes: ['rating', 'text'],
  }).serialize(review);
});

router.get('api.negotiation.messagges', '/messagges/:id', async (ctx) => {
  const negotiation = await ctx.orm.negotiation.findByPk(ctx.params.id);
  const messaggesList = await negotiation.getMessages();
  ctx.body = ctx.jsonSerializer('messagge', {
    attributes: ['senderId', 'receiverId', 'text', 'createdAt'],
  }).serialize(messaggesList);
});

router.get('api.categories', '/categories', async (ctx) => {
  const categories = await ctx.orm.category.findAll();
  ctx.body = ctx.jsonSerializer('categories', {
    attributes: ['id', 'name'],
  }).serialize(categories);
});

router.post('api.objects.create', '/object_create', async (ctx) => {
  const object = ctx.orm.object.build(ctx.request.body);
  const user = ctx.state.currentUser;
  try {
    object.userId = user.id;
    await object.save({ fields: ['views', 'userId', 'categoryId', 'name', 'state', 'description'] });
    ctx.body = { id: user.id };
  } catch (validationError) {
    ctx.body = validationError;
    ctx.status = 400;
  }
});

router.get('api.objects.list', '/:id', async (ctx) => {
  const { currentUser } = ctx.state;
  const categories = ctx.orm.category;
  const negotiations = ctx.orm.negotiation;
  const photos = ctx.orm.photo;
  const objectsList = await ctx.orm.object.findAll({
    where: { userId: currentUser.id },
    include: [{ model: categories }, { model: negotiations }, { model: photos }],
  });
  ctx.body = ctx.jsonSerializer('object', {
    attributes: ['name', 'description', 'state', 'category', 'negotiations', 'photos'],
  }).serialize(objectsList);
});

router.get('api.objects.list_other', '/other/:id', async (ctx) => {
  const { currentUser } = ctx.state;
  const negotiation = await ctx.orm.negotiation.findByPk(ctx.params.id);
  const categories = ctx.orm.category;
  const negotiations = ctx.orm.negotiation;
  const photos = ctx.orm.photo;
  if (negotiation.sellerId === currentUser.id) {
    const objectsList = await ctx.orm.object.findAll({
      where: { userId: negotiation.customerId },
      include: [{ model: categories }, { model: negotiations }, { model: photos }],
    });
    ctx.body = ctx.jsonSerializer('object', {
      attributes: ['name', 'description', 'state', 'category', 'negotiations', 'photos'],
    }).serialize(objectsList);
  } else if (negotiation.customerId === currentUser.id) {
    const objectsList = await ctx.orm.object.findAll({
      where: { userId: negotiation.sellerId },
      include: [{ model: categories }, { model: negotiations }, { model: photos }],
    });
    ctx.body = ctx.jsonSerializer('object', {
      attributes: ['name', 'description', 'state', 'category', 'negotiations', 'photos'],
    }).serialize(objectsList);
  }
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
