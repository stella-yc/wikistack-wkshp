const router = require('express').Router();
const { Page, User }  = require('../models');


router.get('/', (req, res, next) => {
  User.findAll({})
    .then(users => {
      res.render('users.html', {users: users});
    })
    .catch(console.error);
});

router.get('/:id', (req, res, next) => {
  const user = User.findById(req.params.id);
  const pages = Page.findAll({
    where: {
      authorId: req.params.id
    }
  });
  Promise.all([user, pages])
    .then(([userData, pagesData]) => {
      res.render('user.html', {user: userData, pages: pagesData});
    })
    .catch(console.error);
});

module.exports = router;
