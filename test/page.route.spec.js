const supertest = require('supertest-as-promised');
const app = require('../app.js');
// supertest's expect is different from mocha's expect!
const agent = supertest.agent(app);
const { User, Page } = require('../models');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
const expect = require('chai').expect;


describe('Http Requests for Pages', function () {
  before(function () {
    return User.sync({ force: true })
      .then(() => {
        return Page.sync({ force: true })
      })
      .catch(console.error);
  });

  after(function () {
    return User.sync({ force: true })
      .then(() => {
        return Page.sync({ force: true })
      })
      .catch(console.error);
  });

  describe('GET /', function () {
    it('responds with 200 status code', function () {
      return agent
        .get('/')
        .expect(200);
    });
  });

  describe('GET /wiki', function () {
    it('responds with 200 status code', function () {
      return agent
        .get('/wiki')
        .expect(302);
    });
  });
  describe('GET /wiki/add', function () {
    it('responds with a 200 status code', function () {
      return agent
        .get('/wiki/add')
        .expect(200);
    });
  });
  describe('GET /wiki/:page', function () {
    before(function () {
      return User.create({
        name: 'Azula',
        email: 'azula@azula.com'
      })
        .then(user => {
          return Page.create({
            title: 'Azula Rat',
            content: 'Gray Rat',
            status: 'open'
          })
            .then(page => {
              return page.setAuthor(user);
            })
            .catch(console.error);
        });
    });

    it('responds with a 200 status code for valid page', function () {
      return agent
        .get('/wiki/Azula_Rat')
        .expect(200);
    });

    it('responds with an error code if page is invalid', function () {
      return agent
        .get('/wiki/Clover_Rat')
        .expect(404);
    });

  });
  describe('GET /wiki/:page/similar', function () {
    before(function () {
      let pageOne = Page.create({
        title: 'Yum',
        content: 'Gray Rat',
        status: 'open',
        tags: 'cheerios'
      });
      let pageTwo = Page.create({
        title: 'Tasty',
        content: 'Brown Rat',
        status: 'open',
        tags: 'cheerios'
      });
      Promise.all([pageOne, pageTwo])
        .then(([first, sec]) => {
          pageOne = first;
          pageTwo = sec;
        })
        .catch(console.error);
    });
    it('responds with a 200 status code for valid page', function () {
      return agent
        .get('/wiki/Yum/similar')
        .expect(200);
    });
    it('responds with an error code if page is invalid', function () {
      return agent
        .get('/wiki/Yuck/similar')
        .expect(404);
    });
  });
  describe('GET /wiki/search/:tag', function () {
    before(function () {
      return Page.create({
        title: 'Fuzzy',
        content: 'rats',
        tags: 'fur'
      })
      .catch(console.error);
    });
    it('responds with a 200 status code', function () {
      return agent
        .get('/wiki/search?Tags=fur')
        .expect(200);
    })
  });
  describe('POST /wiki', function () {
    it('responds with a 302', function () {
      return agent
        .post('/wiki')
        .send({
          title: 'Cupcake',
          content: 'love it',
          author: 'Scruff Rat',
          email: 'scruffy@olive.com'
        })
        .expect(302);
    });
    it('creates a page in the database', function () {
      return agent
        .post('/wiki')
        .send({
          title: 'Pistachio',
          content: 'hard nut',
          author: 'Scruff Rat',
          email: 'scruffy@olive.com'
        })
        .then(() => {
          Page.findAll({
            where: {
              title: 'Pistachio'
            }
          })
          .then(page => {
            expect(page).to.have.lengthOf(1);
            expect(page[0].title).to.equal('Pistachio');
            expect(page[0].content).to.equal('hard nut');
          });
        });
    });
  });


}); // page routes
