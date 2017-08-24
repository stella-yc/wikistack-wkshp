const router = require('express').Router();

const userRouter = require('./user');
const wikiRouter = require('./wiki');

router.use('/cat', () => {console.log('cat is here');});
router.use('/wiki', wikiRouter);
router.use('/user', userRouter);

module.exports = router;
