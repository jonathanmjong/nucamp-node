const supertest = require('supertest');
const chai = require('chai');
const expect = chai.expect;
const app = require('../app');
const request = supertest(app);
const mongoose = require('mongoose');
const { postCampsite, postComment, fakeCampsite, fakeComment, loginUser1, loginUser2, loginAdmin } = require('./utilities');
const { logins, tokens, posts } = require('./identification');


describe('GET endpoints', function () {
    describe('Unauthorized', () => {
        it('GET / should return 200 and text/html', done => {
            request.get('/')
                .expect(200)
                .expect('Content-Type', /html/)
                .end((err, res) => {
                    if (err) return done(err);
                    return done();
                });
        });
        it('GET /campsites should return 200 in JSON when unauthorized', done => {
            request.get('/campsites')
                .expect(200)
                .expect('Content-Type', /json/)
                .end((err, res) => {
                    if (err) return done(err);
                    done();
                });
        })
        it(`GET /campsites/campsiteId should return 200 in JSON when unauthorized`, done => {
            request.get(`/campsites/${posts.campsiteId}`)
                .expect(200)
                .expect('Content-Type', /json/)
                .end((err, res) => {
                    if (err) return done(err);
                    done();
                });
        })
        it(`GET /campsites/campsiteId/comments should return 200 in JSON  when unauthorized`, done => {
            request.get(`/campsites/${posts.campsiteId}/comments`)
                .expect(200)
                .expect('Content-Type', /json/)
                .end((err, res) => {
                    if (err) return done(err);
                    done();
                });
        })
    })
    describe('User', () => {

        it('GET /campsites should return 200 in JSON when user', done => {
            request.get('/campsites')
                .set('Authorization', `Bearer ${tokens.user1}`)
                .expect(200)
                .expect('Content-Type', /json/)
                .end((err, res) => {
                    if (err) return done(err);
                    done();
                });

        })
        it(`GET /campsites/campsiteId should return 200 in JSON when user`, done => {
            request.get(`/campsites/${posts.campsiteId}`)
                .set('Authorization', `Bearer ${tokens.user1}`)
                .expect(200)
                .expect('Content-Type', /json/)
                .end((err, res) => {
                    if (err) return done(err);
                    done();
                });
        })
        it(`GET /campsites/campsiteId/comments should return 200 in JSON when user`, done => {
            request.get(`/campsites/${posts.campsiteId}/comments`)
                .set('Authorization', `Bearer ${tokens.user1}`)
                .expect(200)
                .expect('Content-Type', /json/)
                .end((err, res) => {
                    if (err) return done(err);
                    done();
                });

        })
    })
    describe('Admin', () => {
        it(`GET /campsites/campsiteId/comments/commentId should return 200 in JSON when admin`, done => {
            request.get(`/campsites/${posts.commentCampsiteId}/comments/${posts.commentId}`)
                .set('Authorization', `Bearer ${tokens.admin}`)
                .expect(200)
                .expect('Content-Type', /json/)
                .end(done);

        })
        it(`GET /campsites/campsiteId/comments should return 200 in JSON when admin`, done => {
            request.get(`/campsites/${posts.campsiteId}/comments`)
                .set('Authorization', `Bearer ${tokens.admin}`)
                .expect(200)
                .expect('Content-Type', /json/)
                .end((err, res) => {
                    if (err) return done(err);
                    done();
                });

        })
        it('GET /campsites should return 200 in JSON when admin', done => {
            request.get('/campsites')
                .set('Authorization', `Bearer ${tokens.admin}`)
                .expect(200)
                .expect('Content-Type', /json/)
                .end((err, res) => {
                    if (err) return done(err);
                    done();
                });

        });
    })
})