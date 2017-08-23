const express = require('express');
const morgan = require('morgan');
const chalk = require('chalk');
const bodyParser = require('body-parser');
const nunjucks = require('nunjucks');
const { User, Page, db } = require('./models');

// initialize app
const app = express();

// logging
app.use(morgan('dev'));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

// nunjucks rendering setup
nunjucks.configure('views', {
    autoescape: true,
    express: app
});

// // point nunjucks to the directory containing templates and turn off caching; configure returns an Environment
// // instance, which we'll want to use to add Markdown support later.
// var env = nunjucks.configure('views', {noCache: true});
// // have res.render work with html files
// app.set('view engine', 'html');
// // when res.render works with html files, have it use nunjucks to do so
// app.engine('html', nunjucks.render);

app.use((req, res, next) => {
  console.log('middleware is working!');
  next();
});

// serve static files
app.use(express.static('public'));

app.get('/', (req, res, next) => {
  res.render('index.html');
});

db.sync()
  .then(() => {
    app.listen(1337, () =>
      console.log(chalk.blue('app is listening on port 1337'))
    );
  })
  .catch(err => {
    console.error(chalk.magenta(err));
  });

