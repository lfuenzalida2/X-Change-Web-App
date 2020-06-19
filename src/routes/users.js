const KoaRouter = require('koa-router');
const sendRegistrationEmail = require('../mailers/registration');

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
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < string.length; i++) {
    const element = string[i];

    if (element === element.toUpperCase()) {
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
  });
});

router.post('users.create', '/', async (ctx) => {
  const newUser = ctx.orm.user.build(ctx.request.body);
  const values = ctx.request.body;
  try {
    if (values.password !== values.confirm_password) {
      throw new MyError('PasswordError', 'Las contraseñas no coinciden. Inténtalo nuevamente.');
    } else if (values.mail !== values.confirm_mail) {
      throw new MyError('MailError', 'Los correos no coinciden. Inténtalo nuevamente.');
    } else if (!Valid(values.password)) {
      throw new MyError('PasswordError', 'La constraseña debe tener al menos 1 letra en mayuscula, 1 número y largo de 8 caracteres.');
    }
    await newUser.save({ fields: ['username', 'password', 'mail', 'number', 'region', 'profilePicture'] });
    await sendRegistrationEmail(ctx, { user: newUser });
    ctx.redirect(ctx.router.url('session.new'));
  } catch (validationError) {
    ctx.body = validationError;
    ctx.status = 400;
  }
});

router.get('users.edit', '/:id/edit', async (ctx) => {
  const newUser = await ctx.orm.user.findByPk(ctx.params.id);
  await ctx.render('users/edit', {
    newUser,
    submitVariable: ctx.router.url('users.update', { id: newUser.id }),
  });
});


router.patch('users.update', '/:id', async (ctx) => {
  const newUser = await ctx.orm.user.findByPk(ctx.params.id);
  try {
    const {
      username, password, mail, number, region, profilePicture,
    } = ctx.request.body;
    await newUser.update({
      username, password, mail, number, region, profilePicture,
    });
    ctx.redirect(ctx.router.url('users.index', { id: ctx.params.id }));
  } catch (validationError) {
    await ctx.render('users/edit', {
      newUser,
      errors: validationError.errors,
      submitVariable: ctx.router.url('users.update', { id: newUser.id }),
    });
  }
});

router.del('users.delete', '/:id', async (ctx) => {
  const newUser = await ctx.orm.user.findByPk(ctx.params.id);
  await newUser.destroy();
  ctx.redirect(ctx.router.url('users.list'));
});

router.get('users.index', '/:id', async (ctx) => {
  const currentUser = await ctx.state.currentUser;
  const user = await ctx.orm.user;
  const reviews = await ctx.orm.review.findAll({
    where: { reviewedId: currentUser.id },
    include: [{ model: user, as: 'reviewed' }, { model: user, as: 'reviewer' }],
  });
  await ctx.render('account/index', {
    reviews,
    editProfile: ctx.router.url('users.edit', { id: currentUser.id }),
    otherProfile: (other) => ctx.router.url('users.view', { id: other.id }),
    viewObjects: ctx.router.url('objects.list'),
    viewNegotiations: ctx.router.url('negotiations.list'),
  });
});

router.post('users.view', '/:id/profile', async (ctx) => {
  const { reviewerId } = ctx.request.body;
  const reviewer = await ctx.orm.user.findByPk(reviewerId);
  const user = await ctx.orm.user;
  const reviews = await ctx.orm.review.findAll({
    where: { reviewedId: reviewerId },
    include: [{ model: user, as: 'reviewed' }, { model: user, as: 'reviewer' }],
  });
  await ctx.render('account/other', {
    reviewer,
    reviews,
    otherProfile: (other) => ctx.router.url('users.view', { id: other.id }),
  });
});

module.exports = router;
