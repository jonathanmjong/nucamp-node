const supertest = require('supertest');
const chai = require('chai');
const expect = chai.expect;
const app = require('../app');
const request = supertest(app);
const mongoose = require('mongoose');
const { postCampsite, postComment, fakeCampsite, fakeComment } = require('./utilities');
const { logins, tokens, posts } = require('./identification');


describe('Final tests/cleanup', function (done) {


    it('GET /users/logout for user should redirect to /', done => {
        request.get('/users/logout')
            .set('Authorization', `Bearer ${tokens.user1}`)
            .expect(302)
            .end((err, res) => {
                if (err) return done(err);
                done();
            });
    })
    after(done => {
        request.get('/users/logout')
            .set('Authorization', `Bearer ${tokens.admin}`)
            .expect(302)
            .end((err, res) => {
                if (err) return done(err);
                done();
            });
    })



})