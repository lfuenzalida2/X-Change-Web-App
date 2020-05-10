const KoaRouter = require('koa-router');

const router = new KoaRouter();
const parse = require('imagemagick');
const fs = require('fs');
const fileStorage = require('../services/file-storage');

async function loadObject(ctx, next) {
  ctx.state.object = await ctx.orm.object.findByPk(ctx.params.id);
  return next();
}

function MyError(name, message) {
  this.name = name;
  this.errors = [{ message }];
  this.stack = (new Error()).stack;
}

router.get('objects.list', '/', async (ctx) => {
  const objectsList = await ctx.orm.object.findAll();
  await ctx.render('objects/index', {
    objectsList,
    newObjectPath: ctx.router.url('objects.new'),
    editObjectPath: (object) => ctx.router.url('objects.edit', { id: object.id }),
    deleteObjectPath: (object) => ctx.router.url('objects.delete', { id: object.id }),
    showObjectPath: (object) => ctx.router.url('objects.show', { id: object.id }),
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
  const values = await ctx.orm.category.findAll({ where: {id : parseInt(object.categoryId)} });
  try {
    console.log(values);
    if (!values.length) {
      throw new MyError('CategoryIdError', "The Id Category doesn't exist, please create one before adding an object to it");
    }
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
  const { userId, categoryId, name, state, description } = ctx.request.body;
  const values = await ctx.orm.category.findAll({ where: {id: categoryId} });
  try {
    if (!values.length) {
      throw new MyError('CategoryIdError', "The Id Category doesn't exist, please create one before adding an object to it");
    }
    await object.update({ userId, categoryId, name, state, description });
    ctx.redirect(ctx.router.url('objects.list'));
  } catch (validationError) {
    console.log(validationError);
    await ctx.render('objects/edit', {
      object,
      errors: validationError.errors,
      home: ctx.router.url('objects.list'),
      submitObjectPath: ctx.router.url('objects.update', { id: object.id }),
    });
  }
});

router.del('objects.delete', '/:id', loadObject, async (ctx) => {
  const { object } = ctx.state;
  await object.destroy();
  ctx.redirect(ctx.router.url('objects.list'));
});

router.get('objects.show', '/:id/show', loadObject, async (ctx) => {
  const { object } = ctx.state;
  await ctx.render('objects/show', {
    object,
    home: ctx.router.url('objects.list'),
    submitObjectPath: ctx.router.url('objects.load', { id: object.id }),
    // load photos
  });
});

router.post('objects.load', '/:id', loadObject, async (ctx) => {
  const { object } = ctx.state;
  const { list } = ctx.request.files;
  const fileName = list.name;
  const objectId = object.id;
  const photo = ctx.orm.photo.build({ fileName, objectId });
  try {
    await photo.save({ fields: ['fileName', 'objectId'] });
    ctx.redirect('objects/show');
  } catch (validationError) {
    await ctx.render('objects/show', {
      object,
      home: ctx.router.url('objects.list'),
      errors: validationError.errors,
      submitObjectPath: ctx.router.url('objects.load', { id: object.id }),
    });
  }
  await fileStorage.upload(list);
  ctx.redirect(ctx.router.url('objects.show', { id: object.id }));
});

module.exports = router;
