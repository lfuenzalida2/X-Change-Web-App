const KoaRouter = require('koa-router');

const router = new KoaRouter();

router.get('users.list', '/', async (ctx) => {
  const usersList = await ctx.orm.User.findAll();
  await ctx.render('users/index', {
    usersList,
  });
});

router.get('users.new', '/new', async (ctx) => {
  const newUser = await ctx.orm.User.build();
  await ctx.render('users/new', {
    newUser,
    submitVariable: ctx.router.url('users.create'),
  });
});

router.post('users.create', '/', async (ctx) => {
  const newUser = ctx.orm.User.build(ctx.request.body);
  console.log(newUser);
  try {
    await newUser.save({ fields: ['username', 'password', 'mail', 'number', 'region', 'profile_picture'] });
    ctx.redirect(ctx.router.url('users.list'));
  } catch (validationError) {
    await ctx.render('users/new', {
      newUser,
      errors: validationError.errors,
      submitVariable: ctx.router.url('users.create'),
    });
  }
});


module.exports = router;
