const KoaRouter = require('koa-router');
const { Op } = require('sequelize');

const router = new KoaRouter();

function sortByDateDesc(a, b) {
  return -(new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime());
}

router.get('api.negotiations.list', '/', async (ctx) => {
  const users = await ctx.orm.user;
  const currentUser = await ctx.state.currentUser;
  const negotiationsList = await ctx.orm.negotiation.findAll({
    where: {
      [Op.or]: [{ sellerId: { [Op.eq]: currentUser.id } },
        { customerId: { [Op.eq]: currentUser.id } }],
    },
    include: [{ model: users, as: 'customer', attributes: ['username'] }, { model: users, as: 'seller', attributes: ['username'] }],
  });
  negotiationsList.sort(sortByDateDesc);
  ctx.response.body = ctx.jsonSerializer('negotiation', {
    pluralizeType: false,
    attributes: ['state', 'customer', 'seller'],
    topLevelLinks: {
      self: `${ctx.origin}${ctx.router.url('api.negotiations.list')}`,
    },
    dataLinks: {
      self: (dataset, negotiation) => `${ctx.origin}/api/negotiations/${negotiation.id}`,
    },
  }).serialize(negotiationsList);
});

router.get('api.negotiation.show', '/:id', async (ctx) => {
  const { currentUser } = ctx.state;
  const users = await ctx.orm.user;
  const objects = await ctx.orm.object;
  const negotiation = await ctx.orm.negotiation.findOne({
    where: { id: ctx.params.id },
    include: [{ model: users, as: 'customer' }, { model: users, as: 'seller' }, { model: objects }],
  });
  if (negotiation.customerId === currentUser.id || negotiation.sellerId === currentUser.id) {
    ctx.body = ctx.jsonSerializer('negotiation', {
      pluralizeType: false,
      attributes: ['state', 'customer', 'seller', 'objects'],
      topLevelLinks: {
        self: `${ctx.origin}${ctx.router.url('api.negotiation.show', { id: negotiation.id })}`,
      },
      customer: {
        pluralizeType: false,
        ref: 'id',
        attributes: ['username', 'region'],
      },
      seller: {
        pluralizeType: false,
        ref: 'id',
        attributes: ['username', 'region'],
      },
      objects: {
        keyForAttribute: 'camelCase',
        pluralizeType: false,
        ref: (dataset, object) => object.id,
        attributes: ['name', 'description', 'userId'],
      },
      dataLinks: {
        related: `${ctx.origin}${ctx.router.url('api.negotiation.messages', { id: negotiation.id })}`,
      },
    }).serialize(negotiation);
  } else {
    ctx.throw(403, 'You cannot have access to this negotiation');
  }
});


router.get('api.negotiation.messages', '/:id/messages', async (ctx) => {
  const { currentUser } = ctx.state;
  const negotiation = await ctx.orm.negotiation.findByPk(ctx.params.id);
  if (negotiation.customerId === currentUser.id || negotiation.sellerId === currentUser.id) {
    const users = ctx.orm.user;
    const messagesList = await negotiation.getMessages({ include: [{ model: users, as: 'sender' }] });
    ctx.body = ctx.jsonSerializer('message', {
      pluralizeType: false,
      keyForAttribute: 'camelCase',
      attributes: ['text', 'createdAt', 'sender'],
      topLevelLinks: {
        self: `${ctx.origin}${ctx.router.url('api.negotiation.messages', { id: negotiation.id })}`,
        related: `${ctx.origin}${ctx.router.url('api.negotiation.show', { id: negotiation.id })}`,
      },
      sender: {
        ref: 'id',
        attributes: ['username'],
        pluralizeType: false,
      },
    }).serialize(messagesList);
  } else {
    ctx.throw(403, 'You cannot have access to this negotiation');
  }
});

router.post('api.negotiation.new.message', '/:id/messages', async (ctx) => {
  const { currentUser } = ctx.state;
  const negotiation = await ctx.orm.negotiation.findByPk(ctx.params.id);
  if (negotiation.customerId === currentUser.id || negotiation.sellerId === currentUser.id) {
    if (negotiation.state !== 'Cancelled') {
      const { text } = ctx.request.body;
      const senderId = currentUser.id;
      const { sellerId, customerId } = negotiation;
      const receiverId = senderId === sellerId ? customerId : sellerId;
      const message = ctx.orm.message.build({
        senderId, receiverId, text, negotiationId: negotiation.id,
      });
      try {
        await message.save({ fields: ['senderId', 'receiverId', 'text', 'negotiationId'] });
        ctx.body = ctx.jsonSerializer('message', {
          pluralizeType: false,
          keyForAttribute: 'camelCase',
          attributes: ['senderId', 'receiverId', 'text', 'negotiationId', 'createdAt'],
          topLevelLinks: {
            related: `${ctx.origin}${ctx.router.url('api.negotiation.messages', { id: negotiation.id })}`,
          },
        }).serialize(message);
      } catch (e) {
        ctx.throw(500, e);
      }
    } else {
      ctx.throw(403, 'Cannot post a new message because negotiation has ended');
    }
  } else {
    ctx.throw(403, 'You cannot have access to this negotiation');
  }
});

module.exports = router;
