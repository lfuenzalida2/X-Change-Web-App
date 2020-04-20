const KoaRouter = require('koa-router');

const router = new KoaRouter();

async function loadMessage(ctx, next) {
  ctx.state.message = await ctx.orm.message.findByPk(ctx.params.id);
  return next();
}

router.post('messages.create', '/', async (ctx) => {
  const sender = +ctx.request.body.sender;
  const receiver = +ctx.request.body.receiver;
  const negotiation = +ctx.request.body.negotiation;
  const { text } = ctx.request.body;
  const message = ctx.orm.message.build({
    sender, receiver, text, negotiation,
  });
  try {
    await message.save({ fields: ['sender', 'receiver', 'text', 'negotiation'] });
    ctx.redirect('back');
  } catch (validationError) {
    await ctx.redirect('back');
  }
});

router.del('messages.delete', '/:id', loadMessage, async (ctx) => {
  const { message } = ctx.state;
  await message.destroy();
  ctx.redirect('back');
});

module.exports = router;
