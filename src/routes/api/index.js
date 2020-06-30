const KoaRouter = require('koa-router');
const { Op } = require('sequelize');
const fileStorage = require('../../services/file-storage');

const router = new KoaRouter();

function Authentification(currentUser) {
  if (!currentUser) {
    throw Error('Porfavor utiliza un browser para utilizar esta función');
  }
}

function sortByDateDesc(a, b) {
  return -(new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime());
}

function ExceptionName(mensaje) {
  this.mensaje = mensaje;
  this.nombre = 'ExceptionName';
}

router.patch('api.upload', '/upload', async (ctx) => {
  const { currentUser } = ctx.state;
  try {
    Authentification(currentUser);
    if (!ctx.request) {
      throw new ExceptionName('No hay archivos para subir');
    }
    const { file } = ctx.request.files;
    file.name = `${currentUser.id}_profile_${new Date().toLocaleString()}${file.name.slice(file.name.lastIndexOf('.'), file.name.length)}`;
    const profilePicture = file.name;
    await fileStorage.upload(file);
    await currentUser.update({ profilePicture });
    ctx.body = ctx.jsonSerializer('res', 'upload succesful');
  } catch (err) {
    ctx.status = 400;
    ctx.body = { message: err.message };
  }
});

router.get('api.negotiation.get.negotiations', '/negotiations', async (ctx) => {
  const users = await ctx.orm.user;
  const { currentUser } = ctx.state;
  try {
    Authentification(currentUser);
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
  } catch (err) {
    ctx.status = 400;
    ctx.body = { message: err.message };
  }
});

router.get('api.current.user', '/current_user', async (ctx) => {
  const { currentUser } = ctx.state;
  try {
    Authentification(currentUser);
    ctx.body = ctx.jsonSerializer('currentUser', {
      attributes: ['id', 'username', 'profilePicture'],
    }).serialize(currentUser);
  } catch (err) {
    ctx.status = 400;
    ctx.body = { message: err.message };
  }
});

router.get('api.negotiation.review', '/review/:id/:rid/:red', async (ctx) => {
  const { id, rid, red } = ctx.params;
  const { currentUser } = ctx.state;
  try {
    Authentification(currentUser);
    const review = await ctx.orm.review.findOne({
      where: { negotiationId: id, reviewerId: rid, reviewedId: red },
    });
    ctx.body = ctx.jsonSerializer('review', {
      attributes: ['rating', 'text'],
    }).serialize(review);
  } catch (err) {
    ctx.status = 400;
    ctx.body = { message: err.message };
  }
});

router.get('api.negotiation.messagges', '/messagges/:id', async (ctx) => {
  const { currentUser } = ctx.state;
  try {
    Authentification(currentUser);
    const negotiation = await ctx.orm.negotiation.findByPk(ctx.params.id);
    const messaggesList = await negotiation.getMessages();
    ctx.body = ctx.jsonSerializer('messagge', {
      attributes: ['senderId', 'receiverId', 'text', 'createdAt'],
    }).serialize(messaggesList);
  } catch (err) {
    ctx.status = 400;
    ctx.body = { message: err.message };
  }
});

router.get('api.categories', '/categories', async (ctx) => {
  const { currentUser } = ctx.state;
  try {
    Authentification(currentUser);
    const categories = await ctx.orm.category.findAll();
    ctx.body = ctx.jsonSerializer('categories', {
      attributes: ['id', 'name'],
    }).serialize(categories);
  } catch (err) {
    ctx.status = 400;
    ctx.body = { message: err.message };
  }
});

router.post('api.objects.create', '/object_create', async (ctx) => {
  const { currentUser } = ctx.state;
  try {
    Authentification(currentUser);
    const object = ctx.orm.object.build(ctx.request.body);
    const user = ctx.state.currentUser;
    object.userId = user.id;
    await object.save({ fields: ['views', 'userId', 'categoryId', 'name', 'state', 'description'] });
    ctx.body = { id: user.id };
  } catch (err) {
    ctx.status = 400;
    ctx.body = { message: err.message };
  }
});

router.get('api.objects.list', '/:id', async (ctx) => {
  const { currentUser } = ctx.state;
  try {
    Authentification(currentUser);
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
  } catch (err) {
    ctx.status = 400;
    ctx.body = { message: err.message };
  }
});

router.get('api.objects.list_other', '/other/:id', async (ctx) => {
  const { currentUser } = ctx.state;
  try {
    Authentification(currentUser);
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
  } catch (err) {
    ctx.status = 400;
    ctx.body = { message: err.message };
  }
});

router.get('api.negotiation.get', '/negotiation/:id', async (ctx) => {
  const { currentUser } = ctx.state;
  try {
    Authentification(currentUser);
    const negotiation = await ctx.orm.negotiation.findByPk(ctx.params.id);
    let other;
    if (negotiation.customerId === currentUser.id) {
      other = await negotiation.getSeller();
    } else {
      other = await negotiation.getCustomer();
    }
    ctx.body = ctx.jsonSerializer('negotiation', {
      attributes: ['customerId', 'sellerId', 'state'],
    }).serialize(negotiation);
    ctx.body.other = other.username;
  } catch (err) {
    ctx.status = 400;
    ctx.body = { message: err.message };
  }
});

router.del('api.object_del', '/:id/object', async (ctx) => {
  const { currentUser } = ctx.state;
  try {
    Authentification(currentUser);
    ctx.state.negotiation = await ctx.orm.negotiation.findByPk(ctx.params.id);
    const objectNegotiation = ctx.orm.objectNegotiation.build(ctx.request.body);
    await objectNegotiation.destroy();
    ctx.redirect(ctx.router.url('api.objects.list', { id: ctx.params.id }));
  } catch (err) {
    ctx.status = 400;
    ctx.body = { message: err.message };
  }
});

router.post('api.object_add', '/:id/object', async (ctx) => {
  const { currentUser } = ctx.state;
  try {
    Authentification(currentUser);
    const negotiation = await ctx.orm.negotiation.findByPk(ctx.params.id);
    const objectNegotiation = ctx.orm.objectNegotiation.build(ctx.request.body);
    await objectNegotiation.save({ fields: ['negotiationId', 'objectId'] });
    negotiation.changed('updatedAt', true);
    await negotiation.save();
    ctx.redirect(ctx.router.url('api.objects.list', { id: ctx.params.id }));
  } catch (err) {
    ctx.status = 400;
    ctx.body = { message: err.message };
  }
});

module.exports = router;
