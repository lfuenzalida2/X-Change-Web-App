const KoaRouter = require('koa-router');

const router = new KoaRouter();

router.get('users.list', '/', async (ctx) => {
  const usersList = await ctx.orm.User.findAll();
  await ctx.render('users/index', {
    usersList,
    newUserPath: ctx.router.url('users.new'),
    editUserPath: (user) => ctx.router.url('users.edit', { id: user.id_user }),
    delUserPath: (user) => ctx.router.url('users.delete', { id: user.id_user }),
  });
});

router.get('users.new', '/new', async (ctx) => {
  const newUser = await ctx.orm.User.build();
  await ctx.render('users/new', {
    newUser,
    submitVariable: ctx.router.url('users.create'),
    home: ctx.router.url('users.list'),
  });
});

router.post('users.create', '/', async (ctx) => {
  const newUser = ctx.orm.User.build(ctx.request.body);
  try {
    await newUser.save({ fields: ['username', 'password', 'mail', 'number', 'region', 'profile_picture'] });
    ctx.redirect(ctx.router.url('users.list'));
  } catch (validationError) {
    await ctx.render('users/new', {
      newUser,
      errors: validationError.errors,
      home: ctx.router.url('users.list'),
      submitVariable: ctx.router.url('users.create', { id: newUser.id_user }),
    });
  }
});

router.get('users.edit', '/:id/edit', async (ctx) => {
  const newUser = await ctx.orm.User.findByPk(ctx.params.id);
  await ctx.render('users/edit', {
    newUser,
    home: ctx.router.url('users.list'),
    submitVariable: ctx.router.url('users.update', { id: newUser.id_user }),
  });
});


router.patch('users.update', '/:id', async (ctx) => {
  const newUser = await ctx.orm.User.findByPk(ctx.params.id);
  try {
    const { username, password, mail, number, region, profile_picture } = ctx.request.body;
    await newUser.update({ username, password, mail, number, region, profile_picture });
    ctx.redirect(ctx.router.url('users.list'));
  } catch (validationError) {
    await ctx.render('users/edit', {
      newUser,
      errors: validationError.errors,
      home: ctx.router.url('users.list'),
      submitVariable: ctx.router.url('users.update', { id: newUser.id_user}),
    });
  }
});

router.del('users.delete', '/:id', async (ctx) => {
  const newUser = await ctx.orm.User.findByPk(ctx.params.id);
  await newUser.destroy();
  ctx.redirect(ctx.router.url('users.list'));
});

module.exports = router;
