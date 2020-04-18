const KoaRouter = require('koa-router');

const router = new KoaRouter();

async function loadObject(ctx, next) {
  ctx.state.object = await ctx.orm.object.findByPk(ctx.params.id);
  return next();
}

router.get('objects.list', '/', async (ctx) => {
  const objectsList = await ctx.orm.object.findAll();
  await ctx.render('objects/index', {
    objectsList,
    newObjectPath: ctx.router.url('objects.new'),
    editObjectPath: (object) => ctx.router.url('objects.edit', { id: object.id }),
    deleteObjectPath: (object) => ctx.router.url('objects.delete', { id: object.id }),
  });
});

router.get('objects.new', '/new', async (ctx) => {
  const object = ctx.orm.object.build();
  await ctx.render('objects/new', {
    object,
    submitObjectPath: ctx.router.url('objects.create'),
    home: ctx.router.url('objects.list'),
  });
});

router.post('objects.create', '/', async (ctx) => {
  const object = ctx.orm.object.build(ctx.request.body);
  try {
    await object.save({ fields: ['userId', 'categoryId', 'name', 'state', 'description'] });
    ctx.redirect(ctx.router.url('objects.list'));
  } catch (validationError) {
    await ctx.render('objects/new', {
      object,
      home: ctx.router.url('objects.list'),
      errors: validationError.errors,
      submitObjectPath: ctx.router.url('objects.create'),
    });
  }
});

// operaciones a la base de datos son asincronas: await ctx.<something>
router.get('objects.edit', '/:id/edit', loadObject, async (ctx) => {
  const { object } = ctx.state;
  await ctx.render('objects/edit', {
    object,
    home: ctx.router.url('objects.list'),
    submitObjectPath: ctx.router.url('objects.update', { id: object.id }),
  });
});

router.patch('objects.update', '/:id', loadObject, async (ctx) => {
  const { object } = ctx.state;
  try {
    const { userId, categoryId, name, state, description } = ctx.request.body;
    await object.update({ userId, categoryId, name, state, description });
    ctx.redirect(ctx.router.url('objects.list'));
  } catch (validationError) {
    await ctx.render('objects/edit', {
      object,
      errors: validationError.errors,
      submitObjectPath: ctx.router.url('objects.update', { id: object.id }),
    });
  }
});

router.del('objects.delete', '/:id', loadObject, async (ctx) => {
  const { object } = ctx.state;
  await object.destroy();
  ctx.redirect(ctx.router.url('objects.list'));
});

module.exports = router;