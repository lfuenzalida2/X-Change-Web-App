const KoaRouter = require('koa-router');
const crypto = require('crypto');
const util = require('util');

const router = new KoaRouter();

router.get('session.new', '/new', (ctx) => ctx.render('session/new', {
  createSessionPath: ctx.router.url('session.create'),
  notice: ctx.flashMessage.notice,
}));

router.put('session.create', '/', async (ctx) => {
  const { mail, password } = ctx.request.body;
  const user = await ctx.orm.user.findOne({ where: { mail } });
  const isPasswordCorrect = user && await user.checkPassword(password);
  if (isPasswordCorrect) {
    const oldSession = await ctx.orm.session.findOne({ where: { userId: user.id } });
    if (oldSession) {
      await oldSession.destroy();
    }
    const randomBytes = util.promisify(crypto.randomBytes);
    const token = (await randomBytes(32)).toString('hex');
    ctx.session.sessionToken = token;
    const session = ctx.orm.session.build({ userId: user.id, token });
    await session.save({ fields: ['userId', 'token'] });
    return ctx.redirect(ctx.router.url('negotiations.list'));
  }
  return ctx.render('session/new', {
    mail,
    createSessionPath: ctx.router.url('session.create'),
    error: 'Incorrect mail or password',
  });
});

router.delete('session.destroy', '/', async (ctx) => {
  const session = await ctx.orm.session.findOne({ where: { token: ctx.session.sessionToken } });
  await session.destroy();
  ctx.session = null;
  ctx.redirect(ctx.router.url('session.new'));
});

module.exports = router;
