const KoaRouter = require('koa-router');

const router = new KoaRouter();

async function loadReview(ctx, next) {
  ctx.state.review = await ctx.orm.review.findByPk(ctx.params.id);
  return next();
}

router.post('reviews.new', '/new', async (ctx) => {
  const { reviewer, reviewed, negotiation } = ctx.request.body;
  await ctx.render('reviews/new', {
    reviewer,
    reviewed,
    negotiation,
    submitReviewPath: ctx.router.url('reviews.create'),
  });
});

router.post('reviews.create', '/', async (ctx) => {
  const reviewer = +ctx.request.body.reviewer;
  const reviewed = +ctx.request.body.reviewed;
  const negotiation = +ctx.request.body.negotiation;
  const { rating, text } = ctx.request.body;
  const review = ctx.orm.review.build({
    reviewer, reviewed, negotiation, rating, text,
  });
  try {
    await review.save({ fields: ['reviewer', 'reviewed', 'negotiation', 'rating', 'text'] });
    ctx.redirect(ctx.router.url('negotiations.show', { id: negotiation }));
  } catch (validationError) {
    await ctx.render('reviews/new', {
      reviewer,
      reviewed,
      negotiation,
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
