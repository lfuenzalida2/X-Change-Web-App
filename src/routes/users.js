const KoaRouter = require('koa-router');
const sequelize = require('sequelize');

const sendRegistrationEmail = require('../mailers/registration');

const router = new KoaRouter();
const dateTimeFormat = new Intl.DateTimeFormat('en', { year: 'numeric', month: 'short', day: '2-digit' });

function MyError(name, message) {
  this.name = name;
  this.errors = [{ message }];
  this.stack = (new Error()).stack;
}

function sortByDateDesc(a, b) {
  return -(new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime());
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
  const { currentUser } = ctx.state;
  if (currentUser && currentUser.isModerator) {
    await ctx.render('users/index', {
      usersList,
      newUserPath: ctx.router.url('users.new'),
      editUserPath: (user) => ctx.router.url('users.edit', { id: user.id }),
      delUserPath: (user) => ctx.router.url('users.delete', { id: user.id }),
    });
  } else {
    ctx.redirect('back');
  }
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
    } else if (!Valid(values.password)) {
      throw new MyError('PasswordError', 'La contraseña es muy corta, esta debe tener mínimo 8 caracteres');
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
  const { currentUser } = await ctx.state;
  const user = await ctx.orm.user;
  const xChangesGotten = await currentUser.getNegotiationsGotten({ where: { state: 'Accepted' } });
  const xChangesStarted = await currentUser.getNegotiationsStarted({ where: { state: 'Accepted' } });
  const xChangesCount = xChangesGotten.length + xChangesStarted.length;
  const avgQuery = await ctx.orm.review.findAll({
    attributes: [[sequelize.fn('avg', sequelize.col('rating')), 'avgRating']], where: { reviewedId: currentUser.id },
  });
  const avgRating = Math.round(avgQuery[0].dataValues.avgRating);
  const reviews = await ctx.orm.review.findAll({
    where: { reviewedId: currentUser.id },
    include: [{ model: user, as: 'reviewed' }, { model: user, as: 'reviewer' }],
  });
  reviews.sort(sortByDateDesc);
  await ctx.render('account/index', {
    reviews,
    avgRating,
    xChangesCount,
    dateTimeFormat,
    editProfile: ctx.router.url('users.edit', { id: currentUser.id }),
    otherProfile: (other) => ctx.router.url('users.view', { id: other.id }),
    viewObjects: ctx.router.url('objects.list'),
    viewNegotiations: ctx.router.url('negotiations.list'),
  });
});

router.get('users.view', '/:id/profile', async (ctx) => {
  const reviewer = await ctx.orm.user.findByPk(ctx.params.id);
  const { user } = await ctx.orm;
  const xChangesGotten = await reviewer.getNegotiationsGotten({ where: { state: 'Accepted' } });
  const xChangesStarted = await reviewer.getNegotiationsStarted({ where: { state: 'Accepted' } });
  const xChangesCount = xChangesGotten.length + xChangesStarted.length;
  const avgQuery = await ctx.orm.review.findAll({
    attributes: [[sequelize.fn('avg', sequelize.col('rating')), 'avgRating']], where: { reviewedId: reviewer.id },
  });
  const avgRating = Math.round(avgQuery[0].dataValues.avgRating);
  const reviews = await ctx.orm.review.findAll({
    where: { reviewedId: ctx.params.id },
    include: [{ model: user, as: 'reviewed' }, { model: user, as: 'reviewer' }],
  });
  reviews.sort(sortByDateDesc);
  await ctx.render('account/other', {
    reviewer,
    reviews,
    xChangesCount,
    dateTimeFormat,
    avgRating,
    otherProfile: (other) => ctx.router.url('users.view', { id: other.id }),
  });
});

module.exports = router;
