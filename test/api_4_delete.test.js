const supertest = require('supertest');
const chai = require('chai');
const expect = chai.expect;
const app = require('../app');
const request = supertest(app);
const mongoose = require('mongoose');
const { postCampsite, postComment, fakeCampsite, fakeComment, deleteCampsite, deleteComment } = require('./utilities');
const { logins, tokens, posts } = require('./identification');

describe("DELETE endpoints", function () {
    describe('Unauthorized', () => {
        it('DELETE /campsites should return 401 when unauthorized', done => {
            request.delete('/campsites')
                .expect(401)
                .end(done)
        })
        it(`DELETE /campsites/campsiteId should return 401 when unauthorized`, done => {
            request.delete(`/campsites/${posts.campsiteId}`)
                .expect(401)
                .end(done)
        })
        it(`DELETE /campsites/campsiteId/comments should return 401 when unauthorized`, done => {
            request.delete(`/campsites/${posts.campsiteId}/comments`)
                .expect(401)
                .end(done)
        })
    })
    describe('User', () => {
        it('DELETE /campsites should return 403 when user', done => {
            request.delete('/campsites')
                .set('Authorization', `Bearer ${tokens.user1}`)
                .expect(403)
                .end(done)
        })
        it(`DELETE /campsites/campsiteId should return 403 when user`, done => {
            request.delete(`/campsites/${posts.campsiteId}`)
                .set('Authorization', `Bearer ${tokens.user1}`)
                .expect(403)
                .end(done)
        })
        it(`DELETE /campsites/campsiteId/comments should return 403 when user`, done => {
            request.delete(`/campsites/${posts.campsiteId}/comments`)
                .set('Authorization', `Bearer ${tokens.user1}`)
                .expect(403)
                .end(done)
        })
        it(`DELETE /campsites/campsiteId/comments/commentId should return 403 when user is not author of comment`, done => {
            if (!posts.campsiteId) before(postCampsite);
            if (!posts.commentId) before(postComment);
            request.delete(`/campsites/${posts.commentCampsiteId}/comments/${posts.commentId}`)
                .set('Authorization', `Bearer ${tokens.user1}`)
                .expect(403)
                .end(done)
        })
        it(`DELETE /campsites/campsiteId/comments/commentId should return 200 when user is author of comment`, done => {
            if (!posts.campsiteId) before(postCampsite);
            if (!posts.commentId) before(postComment);
            request.delete(`/campsites/${posts.commentCampsiteId}/comments/${posts.commentId}`)
                .set('Authorization', `Bearer ${tokens.user2}`)
                .expect(200)
                .end((err, res) => {
                    if (err) return done(err);
                    return deleteComment(done);
                })
        })
    })


    describe('Admin', () => {
        beforeEach((done) => {
            if (!posts.commentId || !posts.commentCampsiteId) {
                postComment(done);
            } else {
                done();
            }
        });

        it(`DELETE /campsites/campsiteId/comments/commentId should return 200 when admin`, done => {
            request.delete(`/campsites/${posts.commentCampsiteId}/comments/${posts.commentId}`)
                .set('Authorization', `Bearer ${tokens.admin}`)
                .expect(200)
                .end((err, res) => {
                    if (err) done(err);
                    expect(res.body).to.have.property('featured');
                    return deleteComment(done);
                })
        })

        it(`DELETE /campsites/campsiteId/comments should return 200 when admin`, done => {
            before(postComment);
            request.delete(`/campsites/${posts.campsiteId}/comments`)
                .set('Authorization', `Bearer ${tokens.admin}`)
                .expect(200)
                .end((err, res) => {
                    if (err) done(err);
                    expect(res.body)
                        .to.have.property('comments')
                        .that.is.an('array')
                        .with.lengthOf(0);

                    return deleteComment(done);
                })
        })

        it('DELETE /campsites should return 200 when admin', done => {
            request.delete('/campsites')
                .set('Authorization', `Bearer ${tokens.admin}`)
                .expect(200)
                .end((err, res) => {
                    if (err) done(console.log(err));
                    expect(res.body).to.have.property('deletedCount');
                    return deleteCampsite(done);
                })
        })
    })
})