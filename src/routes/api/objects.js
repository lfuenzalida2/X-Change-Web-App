const KoaRouter = require('koa-router');
const Fuse = require('fuse.js');

const router = new KoaRouter();

function sortByDateDesc(a, b) {
  return -(new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
}

const options = {
  includeScore: true,
  shouldSort: true,
  includeMatches: true,
  thereshold: 0.1,
  // Search in `name` and in 'description'
  keys: ['dataValues.name', 'dataValues.description'],
};

router.get('api.objects.list', '/inventory', async (ctx) => {
  const { currentUser } = ctx.state;
  const photos = await ctx.orm.photo;
  const categories = await ctx.orm.category;
  const objectsList = await ctx.orm.object.findAll({
    where: { userId: currentUser.id },
    include: [{ model: photos, limit: 1, attributes: ['fileName'] }, { model: categories, attributes: ['name'] }],
  });
  ctx.body = ctx.jsonSerializer('object', {
    pluralizeType: false,
    attributes: ['title', 'description', 'category', 'photoUrl'],
    keyForAttribute: 'camelCase',
    transform: (record) => {
      record.photoUrl = record.photos.length > 0 ? `https://xchangestorage.s3.us-east-2.amazonaws.com/${record.photos[0].fileName}` : null;
      return record;
    },
    topLevelLinks: {
      self: `${ctx.origin}${ctx.router.url('api.objects.list')}`,
    },
  }).serialize(objectsList);
});

router.post('api.objects.search', '/search', async (ctx) => {
  const search = ctx.request.body; // state, region, categoryId, keywords
  const users = await ctx.orm.user;
  const usersInclude = { model: users, attributes: ['username', 'region'] };
  const categories = await ctx.orm.category;
  const categoriesInclude = { model: categories, attributes: ['name'] };
  if (search.region !== 'todas') {
    usersInclude.where = { region: search.region };
  }
  const includeStatement = [usersInclude, categoriesInclude];
  const whereStatement = search.categoryId !== 'todas'
    ? { categoryId: search.categoryId, state: search.state }
    : { state: search.state };
  const objectsList = await ctx.orm.object.findAll(
    {
      where: whereStatement,
      include: includeStatement,
    },
  );
  if (search.keywords === '') {
    search.keywords = ' ';
  } else {
    options.minMatchCharLength = Math.ceil(search.keywords.length / 2);
  }
  const fuse = new Fuse(objectsList, options);
  const result = fuse.search(search.keywords);
  if (search.keywords === ' ') {
    result.sort(sortByDateDesc);
  }
  ctx.body = ctx.jsonSerializer('object', {
    pluralizeType: false,
    keyForAttribute: 'camelCase',
    attributes: ['user', 'name', 'description', 'category'],
    topLevelLinks: {
      self: `${ctx.origin}${ctx.router.url('api.objects.search')}`,
    },
    transform: (record) => record.item.dataValues,
  }).serialize(result);
});

router.post('api.object.new', '/new', async (ctx) => {
  const { currentUser } = ctx.state;
  const { name, description, categoryId } = ctx.request.body;
  const category = await ctx.orm.category.findByPk(categoryId, { attributes: ['name'] });
  if (category) {
    const userId = currentUser.id;
    const object = ctx.orm.object.build({
      name, description, categoryId, userId,
    });
    try {
      await object.save({ fields: ['userId', 'name', 'description', 'categoryId', 'views', 'state'] });
      ctx.body = ctx.jsonSerializer('object', {
        pluralizeType: false,
        keyForAttribute: 'camelCase',
        attributes: ['userId', 'name', 'description', 'category', 'createdAt'],
        transform: (record) => {
          record.category = category;
          return record;
        },
      }).serialize(object);
      ctx.status = 201;
    } catch (e) {
      ctx.throw(500, e);
    }
  } else {
    ctx.throw(400, `categoryId does not exist. Check ${ctx.origin}${ctx.router.url('api.categories.list')}`);
  }
});

module.exports = router;
