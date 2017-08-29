// 'use strict';

// const chai = require('chai');
// const expect = chai.expect;
// const spies = require('chai-spies');
// chai.use(spies);

// describe('Practice Testing', function() {
//   it('should add 2 + 2 = 4', function() {
//     expect(2 + 2).to.equal(4);
//   });
//   it('executes setTimeout properly', function(done) {
//     var start = new Date();

//     setTimeout(function() {
//       var duration = new Date() - start;
//       expect(duration).to.be.closeTo(1000, 50);
//       done();
//     }, 1000);
//   });
//   it('verifies forEach is called on each array element', function() {
//     const arr = [1, 2, 3, 4, 5, 6];
//     const iterator = el => console.log(el);
//     const spy = chai.spy(iterator)
//     arr.forEach(spy);
//     expect(spy).to.have.been.called.exactly(6);
//   });
// });
