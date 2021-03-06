const KoaRouter = require('koa-router');
const { Op } = require('sequelize');
const axios = require('axios');
const fileStorage = require('../services/file-storage');
const translatorConfig = require('../config/translator');

const router = new KoaRouter();
function sortByDateDesc(a, b) {
  return -(new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime());
}

function ExceptionName(mensaje) {
  this.mensaje = mensaje;
  this.nombre = 'ExceptionName';
}

router.post('api.translate', '/translate', async (ctx) => {
  const { messages, targetLanguage } = ctx.request.body;
  const promises = [];
  try {
    for (let i = 0; i < messages.length; i++) {
      if (messages[i].attributes.language !== targetLanguage) {
        promises.push(
          axios({
            method: 'GET',
            url: 'https://systran-systran-platform-for-language-processing-v1.p.rapidapi.com/translation/text/translate',
            headers: translatorConfig,
            params: {
              source: messages[i].attributes.language,
              target: targetLanguage,
              input: messages[i].attributes.text.replace(/\n/g, ''),
            },
          }).then((response) => {
            messages[i].attributes.text = response.data.outputs[0].output;
          }),
        );
      }
    }
    await Promise.all(promises).then(() => {
      ctx.body = JSON.stringify(messages);
      ctx.status = 200;
    });
  } catch (error) {
    ctx.body = error;
    ctx.status = 400;
  }
});

router.patch('xchange.upload', '/upload', async (ctx) => {
  try {
    if (!ctx.request) {
      throw new ExceptionName('No hay archivos para subir');
    }
    const currentUser = await ctx.state.currentUser;
    const { file } = ctx.request.files;
    file.name = `${currentUser.id}_profile_${new Date().getTime() / 1000}${file.name.slice(file.name.lastIndexOf('.'), file.name.length)}`;
    const profilePicture = file.name;
    await fileStorage.upload(file);
    await currentUser.update({ profilePicture });
    ctx.body = ctx.jsonSerializer('res', 'upload succesful');
  } catch (validationError) {
    ctx.body = validationError;
    ctx.status = 400;
  }
});

router.get('xchange.negotiation.get.negotiations', '/negotiations', async (ctx) => {
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

router.get('xchange.current.user', '/current_user', async (ctx) => {
  const currentUser = await ctx.state.currentUser;
  ctx.body = ctx.jsonSerializer('currentUser', {
    attributes: ['id', 'username', 'profilePicture'],
  }).serialize(currentUser);
});

router.get('xchange.negotiation.review', '/review/:id/:rid/:red', async (ctx) => {
  const { id, rid, red } = ctx.params;
  const review = await ctx.orm.review.findOne({
    where: { negotiationId: id, reviewerId: rid, reviewedId: red },
  });
  ctx.body = ctx.jsonSerializer('review', {
    attributes: ['rating', 'text'],
  }).serialize(review);
});

router.get('xchange.negotiation.messagges', '/messagges/:id', async (ctx) => {
  const negotiation = await ctx.orm.negotiation.findByPk(ctx.params.id);
  const messaggesList = await negotiation.getMessages();
  ctx.body = ctx.jsonSerializer('messagge', {
    attributes: ['senderId', 'receiverId', 'text', 'language', 'createdAt'],
  }).serialize(messaggesList);
});

router.get('xchange.categories', '/categories', async (ctx) => {
  const categories = await ctx.orm.category.findAll();
  ctx.body = ctx.jsonSerializer('categories', {
    attributes: ['id', 'name'],
  }).serialize(categories);
});

router.post('xchange.objects.create', '/object_create', async (ctx) => {
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

router.get('xchange.objects.list', '/:id', async (ctx) => {
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

router.get('xchange.objects.list_other', '/other/:id', async (ctx) => {
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

router.get('xchange.negotiation.get', '/negotiation/:id', async (ctx) => {
  const { currentUser } = ctx.state;
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
  ctx.body.picture = other.profilePicture;
});

router.del('xchange.object_del', '/:id/object', async (ctx) => {
  ctx.state.negotiation = await ctx.orm.negotiation.findByPk(ctx.params.id);
  const objectNegotiation = ctx.orm.objectNegotiation.build(ctx.request.body);
  await objectNegotiation.destroy();
  ctx.redirect(ctx.router.url('xchange.objects.list', { id: ctx.params.id }));
});

router.post('xchange.object_add', '/:id/object', async (ctx) => {
  const negotiation = await ctx.orm.negotiation.findByPk(ctx.params.id);
  const objectNegotiation = ctx.orm.objectNegotiation.build(ctx.request.body);
  try {
    await objectNegotiation.save({ fields: ['negotiationId', 'objectId'] });
    negotiation.changed('updatedAt', true);
    await negotiation.save();
    ctx.redirect(ctx.router.url('xchange.objects.list', { id: ctx.params.id }));
  } catch (err) {
    const respuesta = { status: 400, text: 'miegda la wea se ha caido' };
    ctx.body = ctx.jsonSerializer('respuesta', {
      attributes: ['status', 'text'],
    }).serialize(respuesta);
  }
});

module.exports = router;
