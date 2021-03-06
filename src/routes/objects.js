const KoaRouter = require('koa-router');

const router = new KoaRouter();
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
  const { currentUser } = ctx.state;
  const objectsList = await ctx.orm.object.findAll();
  if (currentUser && currentUser.isModerator) {
    await ctx.render('objects/index', {
      objectsList,
      editObjectPath: (object) => ctx.router.url('objects.edit', { id: object.id }),
      deleteObjectPath: (object) => ctx.router.url('objects.delete', { id: object.id }),
      showObjectPath: (object) => ctx.router.url('objects.view', { id: object.id }),
    });
  } else {
    ctx.redirect('back');
  }
});

router.get('objects.new', '/new', async (ctx) => {
  const object = ctx.orm.object.build();
  const categoryList = await ctx.orm.category.findAll();
  await ctx.render('objects/new', {
    object,
    categoryList,
    submitObjectPath: ctx.router.url('objects.create'),
  });
});

router.post('objects.create', '/', async (ctx) => {
  const object = ctx.orm.object.build(ctx.request.body);
  const categoryList = await ctx.orm.category.findAll();
  const user = ctx.state.currentUser;
  try {
    object.userId = user.id;
    await object.save({ fields: ['views', 'userId', 'categoryId', 'name', 'state', 'description'] });
    ctx.redirect(ctx.router.url('inventory.list', { id: user.id }));
  } catch (validationError) {
    await ctx.render('objects/new', {
      object,
      categoryList,
      errors: validationError.errors,
      submitObjectPath: ctx.router.url('objects.create'),
    });
  }
});

// operaciones a la base de datos son asincronas: await ctx.<something>
router.get('objects.edit', '/:id/edit', loadObject, async (ctx) => {
  const { object } = ctx.state;
  const categoryList = await ctx.orm.category.findAll();
  const categoryObject = await object.getCategory();
  await ctx.render('objects/edit', {
    object,
    categoryList,
    categoryObject,
    home: ctx.router.url('objects.list'),
    submitObjectPath: ctx.router.url('objects.update', { id: object.id }),
  });
});

router.patch('objects.update', '/:id', loadObject, async (ctx) => {
  const { object } = ctx.state;
  const categoryList = await ctx.orm.category.findAll();
  const categoryObject = await object.getCategory();
  const {
    userId, categoryId, name, state, description, views,
  } = ctx.request.body;
  const values = await ctx.orm.category.findAll({ where: { id: categoryId } });
  try {
    if (!values.length) {
      throw new MyError('CategoryIdError', 'Esta categoría no existe, inténtalo nuevamente.');
    }
    await object.update({
      userId, categoryId, name, state, description, views,
    });
    ctx.redirect(ctx.router.url('objects.view', { id: object.id }));
  } catch (validationError) {
    await ctx.render('objects/edit', {
      object,
      categoryList,
      categoryObject,
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

router.get('objects.view', '/:id', loadObject, async (ctx) => {
  const { object } = ctx.state;
  const owner = await object.getUser();
  const category = await object.getCategory();
  const views = object.views + 1;
  await object.update({ views });
  await ctx.render('objects/view', {
    object,
    owner,
    category: category.name,
    editObjectPath: ctx.router.url('objects.edit', { id: object.id }),
    createNegotiation: ctx.router.url('negotiations.create'),
    submitObjectPath: ctx.router.url('objects.load', { id: object.id }),
    photos: await ctx.state.object.getPhotos(),
  });
});

router.post('objects.load', '/:id', loadObject, async (ctx) => {
  const { object } = ctx.state;
  const owner = await object.getUser();
  const category = await object.getCategory();
  try {
    const { list } = ctx.request.files;
    if (!list.name) {
      throw new MyError('NoFile', 'No hay archivos para subir.');
    }
    const maxId = await ctx.orm.photo.max('id');
    list.name = `${maxId}${list.name.slice(list.name.lastIndexOf('.'), list.name.length)}`;
    const fileName = list.name;
    const objectId = object.id;
    const photo = ctx.orm.photo.build({ fileName, objectId });
    await photo.save({ fields: ['fileName', 'objectId'] });
    await fileStorage.upload(list);
    ctx.redirect(ctx.router.url('objects.view', { id: object.id }));
  } catch (validationError) {
    await ctx.render('objects/view', {
      object,
      owner,
      category,
      errors: validationError.errors,
      createNegotiation: ctx.router.url('negotiations.create'),
      editObjectPath: ctx.router.url('objects.edit', { id: object.id }),
      submitObjectPath: ctx.router.url('objects.load', { id: object.id }),
      photos: await ctx.state.object.getPhotos(),
    });
  }
});

module.exports = router;
