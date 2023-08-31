const supertest = require('supertest');
const chai = require('chai');
const expect = chai.expect;
const app = require('../app');
const request = supertest(app);
const mongoose = require('mongoose');
const { postCampsite, postComment, loginUser1, loginUser2, loginAdmin } = require('./utilities');
const { logins, tokens, posts } = require('./identification');

const testUserSignup = {
    username: logins.user1.username,
    password: logins.user1.password,
    firstname: "test",
    lastname: "user"
}

// This seems faster than Postman to run every time, but now I need to go through and create tests for everything. Also I'm learning that Express responds to some of these with a 401 instead of a 403, and I'm not sure how to modify that. Or if I even want to.



describe('API tests', function () {
    before(done => { mongoose.connection.once('open', done); });
    before(loginUser1)
    before(loginUser2)
    before(loginAdmin)
    before(postCampsite);
    before(postComment)

    describe('Setup tests', function () {
        /*
        describe('Users endpoints', function () {
            describe('POST /users/signup', function () {
                it(`should be able to signup with ${JSON.stringify(testUserSignup)}`, done => {
                    request.post('/users/signup')
                        .send(testUserSignup)
                        .expect(200)
                        .expect('Content-Type', /json/)
                        .end((err, res) => {
                            if (err) return done(console.log(err));
                            done();
                        });
    
                });
            })
            */
        it(`POST /users/login should be able to login as user with ${JSON.stringify(logins.user1)}`, done => {
            request.post('/users/login')
                .send(logins.user1)
                .expect(200)
                .expect('Content-Type', /json/)
                .end((err, res) => {
                    if (err) return done(err);
                    expect(res.body).to.have.property('token');
                    done()
                })
        })
        it(`POST /users/login should be able to login as user with ${JSON.stringify(logins.user2)}`, done => {
            request.post('/users/login')
                .send(logins.user2)
                .expect(200)
                .expect('Content-Type', /json/)
                .end((err, res) => {
                    if (err) return done(err);
                    expect(res.body).to.have.property('token');
                    done()
                })
        })

        it(`POST /users/login should be able to login as admin with ${JSON.stringify(logins.admin)}`, done => {
            request.post('/users/login')
                .send(logins.admin)
                .expect(200)
                .expect('Content-Type', /json/)
                .end((err, res) => {
                    if (err) return done(err);
                    expect(res.body).to.have.property('token');
                    done()
                })
        })
    })


})