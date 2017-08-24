const router = require('express').Router();
const { Page, User }  = require('../models');

router.get('/', (req, res, next) => {
  res.redirect('/')
});

router.post('/', (req, res, next) => {
  const page = Page.build({
    title: req.body.title,
    content: req.body.content,
    status: req.body.status
  });
  page.save()
    .then((result) => res.json(result))
    .catch(console.error);
});

router.get('/add', (req, res, next) => {
  res.render('addpage.html');
});

module.exports = router;
