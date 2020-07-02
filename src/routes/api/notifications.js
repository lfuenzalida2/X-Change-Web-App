const KoaRouter = require('koa-router');

const router = new KoaRouter();

router.get('api.notifications.list', '/', async (ctx) => {
  const negotiations = await ctx.orm.negotiation;
  const users = await ctx.orm.user;
  const userId = ctx.state.currentUser.id;
  const notificationsList = await ctx.orm.notification.findAll(
    {
      where: { userId }, order: [['id', 'DESC']], include: [{ model: negotiations, include: { model: users, as: 'seller', attributes: ['username'] } }],
    },
  );
  ctx.response.body = ctx.jsonSerializer('notification', {
    attributes: ['type', 'seen', 'negotiation'],
    pluralizeType: false,
    negotiation: {
      ref: 'id',
      attributes: ['state', 'seller'],
      pluralizeType: false,
      relationshipLinks: {
        related: (dataset, negotiation) => `${ctx.origin}/api/negotiations/${negotiation.id}`,
      },
    },
    topLevelLinks: {
      self: `${ctx.origin}${ctx.router.url('api.notifications.list')}`,
    },
  }).serialize(notificationsList);
});

module.exports = router;
