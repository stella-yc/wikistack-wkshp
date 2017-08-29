'use strict';
const chai = require('chai');
const expect = chai.expect;
const { Page, User } = require('../models');
// chai-things plugin allows for assertions on array elements
chai.use(require('chai-things'));

describe('Page Model Fields', function () {
  describe('Stores form values in database', function () {
    let pageOne;
    before(function (done) {
      Page.create({
        title: 'Azula Rat',
        content: 'Gray Rat',
        status: 'open',
        tags: 'claws gray'
      })
        .then(page => {
          pageOne = page;
          done();
        })
        .catch(done);
    });

    after(function (done) {
      pageOne.destroy()
        .then(() => {
          done();
        })
        .catch(done);
    });

    it('stores form values correctly', function () {
      expect(pageOne.title).to.equal('Azula Rat');
      expect(pageOne.content).to.equal('Gray Rat');
      expect(pageOne.status).to.equal('open');
      expect(pageOne.tags).to.include.something.that.equals('claws'); //chai-things
      expect(pageOne.tags).to.include.something.that.equals('gray'); //chai-things
      expect(pageOne.tags).to.have.a.lengthOf(2);
    });

    describe('urlTitle Hook', function () {
      it('creates urlTitle field after validation', function () {
        expect(pageOne.urlTitle).to.exist;
        expect(pageOne.urlTitle).to.equal('Azula_Rat');
      });
    });
    describe('Route Virtual', function () {
      it('creates a virtual route based on urlTitle', function () {
        expect(pageOne.route).to.equal('/wiki/Azula_Rat');
      });
    });
    describe('Page - User association', function () {
      let user;
      before(function (done) {
        User.create({
          name: 'Pepper',
          email: 'Pepper@pepper.com'
        })
          .then(result => {
            user = result;
            done();
          })
          .catch(done);
      });

      after(function (done) {
        user.destroy();
        done();
      });

      it('adds the user foreign key to page instance', function (done) {
        pageOne.setAuthor(user)
          .then(page => {
            expect(page.authorId).to.equal(user.id);
            done();
          })
          .catch(done);
      });
    });
    describe('Validations', function () {
      it('prevents null values being stored', function (done) {
        const badPage = Page.build({
          title: 'Louie'
        });
        badPage.validate()
          .catch(err => {
            expect(err).to.exist;
            expect(err.errors).to.exist;
            done();
          });
      });
    });
  });
});
  describe('Page Model Options', function () {
    describe('findSimilar instance method', function () {
      let pageOne, pageTwo, pageThree;
      before(function (done) {
        pageOne = Page.create({
          title: 'Azula',
          content: 'Gray Rat',
          status: 'open',
          tags: 'claws gray'
        });
        pageTwo = Page.create({
          title: 'Louie',
          content: 'Brown Rat',
          status: 'open',
          tags: 'brown claws'
        });
        pageThree = Page.create({
          title: 'Clover',
          content: 'Hyper Rat',
          status: 'open',
          tags: 'patches white'
        });
        Promise.all([pageOne, pageTwo, pageThree])
          .then(([first, sec, third]) => {
            pageOne = first;
            pageTwo = sec;
            pageThree = third;
            done();
          })
          .catch(done);
      });

      after(function (done) {
        Promise.all([pageOne.destroy(), pageTwo.destroy(), pageThree.destroy()])
          .then(() => done())
          .catch(done);
      });

      it('finds similar pages', function (done) {
        pageOne.findSimilar()
          .then(result => {
            expect(result).to.have.lengthOf(1);
            done();
          })
          .catch(done);
      });

      it('finds the correct similar pages', function (done) {
        pageOne.findSimilar()
          .then(result => {
            expect(result).to.contain.a.thing.with.property('title', pageTwo.title);
            done();
          })
          .catch(done);
      });

      it('does not find false matches', function (done) {
        pageThree.findSimilar()
          .then(result => {
            expect(result).to.have.lengthOf(0);
            done();
          })
          .catch(done);
      });

      it('does not find itself', function (done) {
        pageTwo.findSimilar()
          .then(result => {
            // using chai-things plugin
            expect(result).to.not.contain.a.thing.with.property('id', pageTwo.id);
            done();
          })
          .catch(done);
      });
    });

    describe('findByTag class method', function () {
      let page;
      before(function (done) {
        page = Page.create({
          title: 'About Rats',
          content: 'There are a lot of rats',
          status: 'open',
          tags: 'rat fat fuzzy whiskers',
          urlTitle: 'About_Rats'
        })
          .then(() => {
            done();
          })
          .catch(done);
      });

      after(function (done) {
        Page.findOne({
          where: {
            urlTitle: 'About_Rats'
          }
        })
          .then(testPage => {
            testPage.destroy();
            done();
          })
          .catch(done);
      });

      it('gets pages with a search tag', function (done) {
        Page.findByTag('fat')
          .then(result => {
            // console.log('***', page);
            expect(result[0].title).to.equal('About Rats');
            done();
          })
          .catch(done);
      });
      it('does not get pages without the search tag', function (done) {
        Page.findByTag('llama')
          .then(result => {
            expect(result).to.have.lengthOf(0);
            done();
          })
          .catch(done);
      });
    });
  });
