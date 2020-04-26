const KoaRouter = require('koa-router');

const router = new KoaRouter();

function MyError(name, message) {
  this.name = name;
  this.errors = [{ message }];
  this.stack = (new Error()).stack;
}

function Valid(string) {
  if (string.length < 8) {
    return false;
  }
  let cap = false;
  let num = false;
  for (let i = 0; i < string.length; i++) {
    const element = string[i];

    if (element == element.toUpperCase()) {
      cap = true;
    } else if (typeof Number(element) === 'number') {
      num = true;
    }
  }
  if (cap && num) {
    return true;
  }
}

router.get('users.list', '/', async (ctx) => {
  const usersList = await ctx.orm.user.findAll();
  await ctx.render('users/index', {
    usersList,
    newUserPath: ctx.router.url('users.new'),
    editUserPath: (user) => ctx.router.url('users.edit', { id: user.id }),
    delUserPath: (user) => ctx.router.url('users.delete', { id: user.id }),
  });
});

router.get('users.new', '/new', async (ctx) => {
  const newUser = await ctx.orm.user.build();
  await ctx.render('users/new', {
    newUser,
    submitVariable: ctx.router.url('users.create'),
    home: ctx.router.url('users.list'),
  });
});

router.post('users.create', '/', async (ctx) => {
  const newUser = ctx.orm.user.build(ctx.request.body);
  const values = ctx.request.body;
  try {
    if (values.password !== values.confirm_password) {
      throw new MyError('PasswordError', "The passwords doesn't match, please try again");
    } else if (values.mail !== values.confirm_mail) {
      throw new MyError('MailError', "The emails doesn't match, please try again");
    } else if (!Valid(values.password)) {
      throw new MyError('PasswordError', "The password doesn't fit the requirements");
    }
    await newUser.save({ fields: ['username', 'password', 'mail', 'number', 'region', 'profile_picture'] });
    ctx.redirect(ctx.router.url('users.list'));
  } catch (validationError) {
    await ctx.render('users/new', {
      newUser,
      errors: validationError.errors,
      home: ctx.router.url('users.list'),
      submitVariable: ctx.router.url('users.create', { id: newUser.id }),
    });
  }
});

router.get('users.edit', '/:id/edit', async (ctx) => {
  const newUser = await ctx.orm.user.findByPk(ctx.params.id);
  await ctx.render('users/edit', {
    newUser,
    home: ctx.router.url('users.list'),
    submitVariable: ctx.router.url('users.update', { id: newUser.id }),
  });
});


router.patch('users.update', '/:id', async (ctx) => {
  const newUser = await ctx.orm.user.findByPk(ctx.params.id);
  try {
    const {
      username, password, mail, number, region, profile_picture
    } = ctx.request.body;
    await newUser.update({
      username, password, mail, number, region, profile_picture,
    });
    ctx.redirect(ctx.router.url('users.list'));
  } catch (validationError) {
    await ctx.render('users/edit', {
      newUser,
      errors: validationError.errors,
      home: ctx.router.url('users.list'),
      submitVariable: ctx.router.url('users.update', { id: newUser.id }),
    });
  }
});

router.del('users.delete', '/:id', async (ctx) => {
  const newUser = await ctx.orm.user.findByPk(ctx.params.id);
  await newUser.destroy();
  ctx.redirect(ctx.router.url('users.list'));
});

module.exports = router;
