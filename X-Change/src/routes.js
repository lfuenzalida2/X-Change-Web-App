const KoaRouter = require('koa-router');

const hello = require('./routes/hello');
const index = require('./routes/index');
const negotiations = require('./routes/negotiations');
const messages = require('./routes/messages');
const reviews = require('./routes/reviews');

const categories = require('./routes/categories');
const objects = require('./routes/objects');
const users = require('./routes/users');
const negotiations = require('./routes/negotiations');


const router = new KoaRouter();

router.use('/', index.routes());
router.use('/hello', hello.routes());
router.use('/categories', categories.routes());
router.use('/objects', objects.routes());
router.use('/users', users.routes());
router.use('/negotiations', negotiations.routes());
router.use('/messages', messages.routes());
router.use('/reviews', reviews.routes());

module.exports = router;
