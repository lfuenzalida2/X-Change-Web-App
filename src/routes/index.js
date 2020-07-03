const KoaRouter = require('koa-router');
const sequelize = require('sequelize');
const { QueryTypes } = require('sequelize');
const db = require('../models/index');

const router = new KoaRouter();

router.get('/', async (ctx) => {
  const photos = await ctx.orm.photo;
  const reviews = await ctx.orm.review;
  const mostViewed = await ctx.orm.object.findAll({
    where: { state: true }, limit: 10, order: [['views', 'DESC']], include: [{ model: photos }],
  });
  const categoriesList = await ctx.orm.category.findAll();
  const topXChangers = await db.sequelize.query(`
      SELECT users.id, username, "profilePicture", region, COUNT(negotiations.id) AS "xChanges"
      FROM users
        INNER JOIN negotiations
          ON users.id = negotiations."sellerId"
          OR users.id = negotiations."customerId"
      WHERE negotiations.state = 'Accepted'
        AND negotiations."updatedAt" >= date_trunc('month', CURRENT_DATE - interval '1 month')
        AND negotiations."updatedAt" < date_trunc('month', CURRENT_DATE)
      GROUP BY users.id
      ORDER BY "xChanges" DESC
      LIMIT 3;`, { type: QueryTypes.SELECT });
  const bestXChangers = await ctx.orm.user.findAll({
    attributes: ['user.id', 'username', 'profilePicture', 'region', [sequelize.fn('avg', sequelize.col('reviewsGotten.rating')), 'avgRating']],
    include: [{
      model: reviews,
      attributes: [],
      as: 'reviewsGotten',
      required: true,
      duplicating: false,
    }],
    group: ['user.id'],
    limit: 3,
    order: [[sequelize.col('avgRating'), 'DESC']],
  });
  await ctx.render('index', {
    register: ctx.router.url('users.new'),
    categoriesList,
    showCategoryPath: (category) => ctx.router.url('categories.show', { id: category.id }),
    mostViewed,
    showObjectPath: (object) => ctx.router.url('objects.view', { id: object.id }),
    topXChangers,
    bestXChangers,
  });
});

module.exports = router;
