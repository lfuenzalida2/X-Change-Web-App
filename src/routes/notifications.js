const KoaRouter = require('koa-router');

const router = new KoaRouter();

async function loadNotification(ctx, next) {
  ctx.state.notification = await ctx.orm.notification.findByPk(ctx.params.id);
  return next();
}

router.get('notifications.list', '/load', async (ctx) => {
  const negotiations = await ctx.orm.negotiation;
  const users = await ctx.orm.user;
  const userId = ctx.state.currentUser.id;
  const notificationsList = await ctx.orm.notification.findAll(
    {
      where: { userId }, limit: 10, order: [['id', 'DESC']], include: [{ model: negotiations, include: { model: users, as: 'seller' } }],
    },
  );
  ctx.response.body = notificationsList;
});

router.get('notifications.all', '/', async (ctx) => {
  const negotiations = await ctx.orm.negotiation;
  const users = await ctx.orm.user;
  const userId = ctx.state.currentUser.id;
  const notificationsList = await ctx.orm.notification.findAll(
    {
      where: { userId }, order: [['id', 'DESC']], include: [{ model: negotiations, include: { model: users, as: 'seller' } }],
    },
  );
  await ctx.render('notifications/all', {
    notificationsList,
    deleteNotificationPath: (notification) => ctx.router.url('notifications.delete', { id: notification.id }),
  });
});

router.patch('notifications.update', '/:id', loadNotification, async (ctx) => {
  const { notification } = ctx.state;
  try {
    await notification.update({ seen: true });
    ctx.redirect(ctx.router.url('negotiations.notification', { id: notification.negotiationId }));
  } catch (validationError) {
    ctx.redirect('back');
  }
});

router.del('notifications.delete', '/:id', loadNotification, async (ctx) => {
  const { notification } = ctx.state;
  await notification.destroy();
  ctx.redirect('back');
});

module.exports = router;
