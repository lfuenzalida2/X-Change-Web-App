const KoaRouter = require('koa-router');

const router = new KoaRouter();

async function loadReview(ctx, next) {
  ctx.state.review = await ctx.orm.review.findByPk(ctx.params.id);
  return next();
}

router.get('reviews.list', '/', async (ctx) => {
  const reviewsList = await ctx.orm.review.findAll(); // Then find by a specific userId
  await ctx.render('reviews/index', {
    reviewsList,
    deleteReviewPath: (review) => ctx.router.url('reviews.delete', { id: review.id }),
  });
});

router.post('reviews.new', '/new', async (ctx) => {
  const {
    reviewerId, reviewedId, negotiationId,
  } = ctx.request.body;
  await ctx.render('reviews/new', {
    reviewerId,
    reviewedId,
    negotiationId,
    submitReviewPath: ctx.router.url('reviews.create'),
  });
});

router.post('reviews.create', '/', async (ctx) => {
  const reviewerId = +ctx.request.body.reviewerId;
  const reviewedId = +ctx.request.body.reviewedId;
  const negotiationId = +ctx.request.body.negotiationId;
  const { text, rating } = ctx.request.body;
  const review = ctx.orm.review.build({
    reviewerId, reviewedId, negotiationId, rating, text,
  });
  try {
    await review.save({ fields: ['reviewerId', 'reviewedId', 'negotiationId', 'rating', 'text'] });
    ctx.status = 200;
  } catch (validationError) {
    await ctx.render('reviews/new', {
      reviewerId,
      reviewedId,
      negotiationId,
      errors: validationError.errors,
      submitReviewPath: ctx.router.url('reviews.create'),
    });
  }
});

router.del('reviews.delete', '/:id', loadReview, async (ctx) => {
  const { review } = ctx.state;
  await review.destroy();
  ctx.redirect('back');
});

module.exports = router;
