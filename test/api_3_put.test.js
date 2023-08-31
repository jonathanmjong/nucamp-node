const supertest = require('supertest');
const chai = require('chai');
const expect = chai.expect;
const app = require('../app');
const request = supertest(app);
const mongoose = require('mongoose');
const { postCampsite, postComment, fakeCampsite, fakeComment } = require('./utilities');
const { logins, tokens, posts } = require('./identification');



describe('PUT endpoints', function () {

    describe('Unauthorized', () => {
        it('PUT /campsites should return 401 when unauthorized', done => {
            request.put('/campsites')
                .send(fakeCampsite())
                .expect(401)
                .end(done)
        })

        it(`PUT /campsites/campsiteId should return 401 when unauthorized`, done => {
            request.put(`/campsites/${posts.campsiteId}`)
                .send(fakeCampsite())
                .expect(401)
                .end(done)
        })

        it(`PUT /campsites/campsiteId/comments should return 401 when unauthorized`, done => {
            request.put(`/campsites/${posts.campsiteId}/comments`)
                .send(fakeCampsite())
                .expect(401)
                .end(done)
        })
    })
    describe('User', () => {
        it('PUT /campsites should return 403 when user', done => {
            request.put('/campsites')
                .set('Authorization', `Bearer ${tokens.user1}`)
                .send(fakeCampsite())
                .expect(403)
                .end(done)
        })

        it(`PUT /campsites/campsiteId should return 403 when user`, done => {
            request.put(`/campsites/${posts.campsiteId}`)
                .set('Authorization', `Bearer ${tokens.user1}`)
                .send(fakeCampsite())
                .expect(403)
                .end(done)
        })

        it(`PUT /campsites/campsiteId/comments should return 403 when user`, done => {
            request.put(`/campsites/${posts.campsiteId}/comments`)
                .set('Authorization', `Bearer ${tokens.user1}`)
                .send(fakeCampsite())
                .expect(403)
                .end(done)
        })
    })
    describe('Admin', () => {
        it(`PUT /campsites/campsiteId/comments/commentId should return 403 when admin`, done => {
            request.put(`/campsites/${posts.campsiteId}/comments/${posts.commentId}`)
                .set('Authorization', `Bearer ${tokens.admin}`)
                .send(fakeCampsite())
                .expect(403)
                .end(done)
        })
        it(`PUT /campsites/campsiteId/comments should return 403 when admin`, done => {
            request.put(`/campsites/${posts.campsiteId}/comments`)
                .set('Authorization', `Bearer ${tokens.admin}`)
                .send(fakeCampsite())
                .expect(403)
                .end(done)
        })
        it('PUT /campsites should return 403 when admin', done => {
            request.put('/campsites')
                .set('Authorization', `Bearer ${tokens.admin}`)
                .send(fakeCampsite())
                .expect(403)
                .end(done)
        })
    })
})