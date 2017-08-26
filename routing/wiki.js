const router = require('express').Router();
const { Page, User }  = require('../models');

router.get('/', (req, res, next) => {
  res.redirect('/');
});

router.post('/', (req, res, next) => {
  User.findOrCreate({
    where: {
      name: req.body.author,
      email: req.body.email
    }
  }).spread((user, createdBool) => {
    if (!createdBool) {
      throw new Error('User not created');
    } else {
      return Page.create({
        title: req.body.title,
        content: req.body.content,
        status: req.body.status,
        authorId: user.id
      });
    }
  }).then((page) => {
    res.redirect(page.route);
  })
    .catch((err) => {
      console.error(err);
    });
});

router.get('/add', (req, res, next) => {
  res.render('addpage.html');
});

router.get('/:page', (req, res, next) => {
  Page.findOne({
    where: {
      urlTitle: req.params.page
    }
  })
  .then((page) => {
    res.render('wikipage.html', {
      title: page.title,
      content: page.content,
      urlTitle: page.urlTitle
    });
  })
  .catch(console.error);
});

module.exports = router;
