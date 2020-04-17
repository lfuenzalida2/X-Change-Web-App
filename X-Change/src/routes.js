const KoaRouter = require('koa-router');

const hello = require('./routes/hello');
const index = require('./routes/index');
const categories = require('./routes/categories');
const objects = require('./routes/objects');

const router = new KoaRouter();

router.use('/', index.routes());
router.use('/hello', hello.routes());
router.use('/categories', categories.routes());
router.use('/objects', objects.routes());

module.exports = router;
