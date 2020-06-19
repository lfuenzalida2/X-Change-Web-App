const KoaRouter = require('koa-router');
const { Op } = require('sequelize');

const router = new KoaRouter();

async function loadCategory(ctx, next) {
  ctx.state.category = await ctx.orm.category.findByPk(ctx.params.id);
  return next();
}

router.get('categories.list', '/', async (ctx) => {
  const categoriesList = await ctx.orm.category.findAll();
  await ctx.render('categories/index', {
    categoriesList,
    newCategoryPath: ctx.router.url('categories.new'),
    editCategoryPath: (category) => ctx.router.url('categories.edit', { id: category.id }),
    deleteCategoryPath: (category) => ctx.router.url('categories.delete', { id: category.id }),
  });
});

router.get('categories.show', '/:id', loadCategory, async (ctx) => {
  const { category } = ctx.state;
  const { user } = ctx.orm;
  const currentUser = await ctx.state.currentUser;
  let objectsList;
  if (currentUser) {
    objectsList = await ctx.orm.object.findAll({
      where: { categoryId: category.id, userId: { [Op.not]: id } },
      include: [{ model: user }],
    });
  } else {
    objectsList = await ctx.orm.object.findAll({
      where: { categoryId: category.id },
      include: [{ model: user }],
    });
  }
  await ctx.render('categories/show', {
    objectsList,
    category,
    viewObjectPath: (object) => ctx.router.url('objects.view', { id: object.id }),
  });
});

router.get('categories.new', '/new', async (ctx) => {
  const category = ctx.orm.category.build();
  await ctx.render('categories/new', {
    category,
    submitCategoryPath: ctx.router.url('categories.create'),
  });
});

router.post('categories.create', '/', async (ctx) => {
  const category = ctx.orm.category.build(ctx.request.body);
  try {
    await category.save({ fields: ['name'] });
    ctx.redirect(ctx.router.url('categories.list'));
  } catch (validationError) {
    await ctx.render('categories/new', {
      category,
      errors: validationError.errors,
      submitCategoryPath: ctx.router.url('categories.create'),
    });
  }
});
// operaciones a la base de datos son asincronas: await ctx.<something>
router.get('categories.edit', '/:id/edit', loadCategory, async (ctx) => {
  const { category } = ctx.state;
  await ctx.render('categories/edit', {
    category,
    submitCategoryPath: ctx.router.url('categories.update', { id: category.id }),
  });
});

router.patch('categories.update', '/:id', loadCategory, async (ctx) => {
  const { category } = ctx.state;
  try {
    const { name } = ctx.request.body;
    await category.update({ name });
    ctx.redirect(ctx.router.url('categories.list'));
  } catch (validationError) {
    await ctx.render('categories/edit', {
      category,
      errors: validationError.errors,
      submitCategoryPath: ctx.router.url('categories.update', { id: category.id }),
    });
  }
});

router.del('categories.delete', '/:id', loadCategory, async (ctx) => {
  const { category } = ctx.state;
  await category.destroy();
  ctx.redirect(ctx.router.url('categories.list'));
});

module.exports = router;
