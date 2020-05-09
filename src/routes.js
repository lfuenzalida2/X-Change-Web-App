const KoaRouter = require('koa-router');

const index = require('./routes/index');
const explore = require('./routes/explore');
const negotiations = require('./routes/negotiations');
const messages = require('./routes/messages');
const reviews = require('./routes/reviews');
const categories = require('./routes/categories');
const objects = require('./routes/objects');
const users = require('./routes/users');


const router = new KoaRouter();

router.use('/', index.routes());
router.use('/explore', explore.routes());
router.use('/categories', categories.routes());
router.use('/objects', objects.routes());
router.use('/users', users.routes());
router.use('/negotiations', negotiations.routes());
router.use('/messages', messages.routes());
router.use('/reviews', reviews.routes());

module.exports = router;
