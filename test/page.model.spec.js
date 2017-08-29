'use strict';
const expect = require('chai').expect;
const {Page, User} = require('../models');

// describe('Page Model Fields', function() {
//   describe('Stores form values in database', function() {});
//   describe('Validations', function() {});
// });

describe('Page Model Options', function() {
  describe('Virtual route', function() {
    let page;
    beforeEach(function() {
      page = Page.build({
        title: 'About Rats',
        content: 'There are a lot of rats',
        status: 'open',
        tags: 'rat fat fuzzy whiskers',
        urlTitle: 'About_Rats'
      });
    });
    it('creates a virtual route based on urlTitle', function() {
      expect(page.route).to.equal('/wiki/About_Rats');
    });
  });
  // describe('Page.url title hook', function() {});
  // describe('findSimilar instance method', function() {});
  // describe('Page - User association', function() {});
  describe('findByTag Class methods', function(done) {
    let page;
    before(function(innerDone) {
      page = Page.create({
        title: 'About Rats',
        content: 'There are a lot of rats',
        status: 'open',
        tags: 'rat fat fuzzy whiskers',
        urlTitle: 'About_Rats'
      })
      .then(function() {
        done();
      })
      .catch(innerDone);
    });
    Page.findByTag('fat')
      .then(result => {
        expect(result[0]).to.equal(page);
        done();
      })
      .catch(done);
  });
});
