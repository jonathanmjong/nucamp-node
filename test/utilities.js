const supertest = require('supertest');
const chai = require('chai');
const expect = chai.expect;
const app = require('../app');
const request = supertest(app);
const { logins, tokens, posts } = require('./identification');


const randomRating = () => Math.floor(Math.random() * 5) + 1
const timeString = () => new Date().toString()


const fakeCampsite = () => ({
    name: timeString(),
    image: "image.jpg",
    elevation: Math.floor(Math.random() * 4000),
    description: "Hey, you can only know right now.",
    cost: Math.floor(Math.random() * 100)
})

const fakeComment = () => ({ rating: randomRating(), text: timeString() })

const postCampsite = (done) => {
    if (posts.campsiteId) return done(new Error("posts.campsiteId already exists"));
    request.post(`/campsites`)
        .set('Authorization', `Bearer ${tokens.admin}`)
        .send(fakeCampsite())
        .expect(200)
        .end((err, res) => {
            if (err) { return done(err); }
            expect(res.body).to.have.property('_id')
            posts.campsiteId = res.body._id;
            return done();
        })

}
const postComment = (done, token = tokens.user2) => {
    if (posts.commentId) return done()
    if (!posts.campsiteId) before(postCampsite);
    request.post(`/campsites/${posts.campsiteId}/comments`)
        .set('Authorization', `Bearer ${token}`)
        .send(fakeComment())
        .expect(200)
        .end((err, res) => {
            if (err) { return done(err); }
            expect(res.body).to.have.property('_id')
            posts.commentCampsiteId = posts.campsiteId;
            posts.commentId = res.body.comments[0]._id;
            return done();
        })
}
const deleteComment = (done) => {
    posts.commentCampsiteId = "";
    posts.commentId = "";
    return done();
}

const deleteCampsite = (done) => {
    posts.campsiteId = "";
    return deleteComment(done)
}


const loginUser1 = (done) => {
    request.post('/users/login')
        .send(logins.user1)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
            if (err) return done(err);
            expect(res.body).to.have.property('token');
            tokens.user1 = res.body.token;
            return done()
        })
}

const loginUser2 = (done) => {
    request.post('/users/login')
        .send(logins.user2)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
            if (err) return done(err);
            expect(res.body).to.have.property('token');
            tokens.user2 = res.body.token;
            return done()
        })
}
const loginAdmin = (done) => {
    request.post('/users/login')
        .send(logins.admin)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
            if (err) return done(err);
            expect(res.body).to.have.property('token');
            tokens.admin = res.body.token;
            return done()
        })
}


module.exports = {
    fakeCampsite,
    fakeComment,
    postCampsite,
    postComment,
    loginAdmin,
    loginUser1,
    loginUser2,
    deleteCampsite,
    deleteComment

};