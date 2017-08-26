const router = require('express').Router();
const {Page, User} = require('../models');
const userRouter = require('./user');
const wikiRouter = require('./wiki');

router.get('/', (req, res, next) => {
  Page.findAll({})
    .then(pages => {
      res.render('index.html', {pages: pages});
    })
    .catch(console.error);
  // res.render('index.html');
});

router.use('/wiki', wikiRouter);
router.use('/user', userRouter);

module.exports = router;
