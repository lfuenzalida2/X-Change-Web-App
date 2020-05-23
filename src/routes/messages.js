const KoaRouter = require('koa-router');

const router = new KoaRouter();

async function loadMessage(ctx, next) {
  ctx.state.message = await ctx.orm.message.findByPk(ctx.params.id);
  return next();
}

router.post('messages.create', '/', async (ctx) => {
  const senderId = +ctx.request.body.senderId;
  const receiverId = +ctx.request.body.receiverId;
  const negotiationId = +ctx.request.body.negotiationId;
  const { text } = ctx.request.body;
  const message = ctx.orm.message.build({
    senderId, receiverId, text, negotiationId,
  });
  try {
    await message.save({ fields: ['senderId', 'receiverId', 'text', 'negotiationId'] });
    const negotiation = await message.getNegotiation();
    negotiation.changed('updatedAt', true);
    await negotiation.save();
    const sender = await ctx.orm.user.findByPk(senderId);
    const parsedMessage = `${sender.username} : ${message.text} (${message.createdAt.toLocaleString('es-CL')})`;
    ctx.response.body = parsedMessage;
    // ctx.redirect('back');
  } catch (validationError) {
    // await ctx.redirect('back');
  }
});

router.del('messages.delete', '/:id', loadMessage, async (ctx) => {
  const { message } = ctx.state;
  await message.destroy();
  ctx.redirect('back');
});

module.exports = router;
