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
      var page = Page.build({
        title: req.body.title,
        content: req.body.content,
        status: req.body.status,
        tags: req.body.tags
      });
      return page.save()
        .then(newPage => {
          return newPage.setAuthor(user);
        });
  })
  .then(page => {
    res.redirect(page.route);
  })
  .catch((err) => {
    console.error(err);
  });
});

router.get('/add', (req, res, next) => {
  res.render('addpage.html');
});

router.get('/search', (req, res, next) => {
  Page.findAll({
    where: {
      tags: {
        $overlap: [req.query.tags]
      }
    }
  })
  .then((pages) => {
    res.render('index.html', {pages: pages});
  })
  .catch(next);
});

router.get('/:page', (req, res, next) => {
  Page.findOne({
    where: {
      urlTitle: req.params.page
    },
    include: [
        {model: User, as: 'author'}
    ]
  })
  .then((page) => {
    if (page === null) {
      res.status(404).send();
    } else {
      res.render('wikipage.html', {
        title: page.title,
        content: page.content,
        urlTitle: page.urlTitle,
        author: page.author.name,
        authorId: page.authorId,
        tags: page.tags
      });
    }
  })
  .catch(console.error);
});

router.get('/:page/similar', (req, res, next) => {
  Page.findOne({
    where: {
      urlTitle: req.params.page
    }
  })
  .then(page => {
    if (page) {
      return page.findSimilar();
    } else {
      return null;
    }
  })
  .then(pages => {
    if (!pages) {
      res.sendStatus(404);
    } else {
      res.render('index.html', {pages: pages});
    }
  })
  .catch(next);
});

module.exports = router;
