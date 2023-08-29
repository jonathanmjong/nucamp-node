const supertest = require('supertest');
const chai = require('chai');
const expect = chai.expect;

const app = require('../app');
const request = supertest(app);

let testUserLogin = { username: "testuser5", password: "password" }
let testUserLogin2 = { username: "testuser4", password: "password" }
let testUserSignup = { username: testUserLogin.username, password: testUserLogin.password, firstname: "test", lastname: "user" }
let testAdminLogin = { username: "admin", password: "password" }
let userToken;
let adminToken;
const randomRating = () => Math.floor(Math.random() * 5) + 1
const timeString = () => new Date().toString()

let campsiteTest = () => ({
    name: timeString(),
    image: "image.jpg",
    elevation: Math.floor(Math.random() * 4000),
    description: "Hey, you can only know right now.",
    cost: Math.floor(Math.random() * 100)
})

let commentTest = () => ({ rating: randomRating(), text: timeString() })


// This seems faster than Postman to run every time, but now I need to go through and create tests for everything. Also I'm learning that Express responds to some of these with a 401 instead of a 403, and I'm not sure how to modify that. Or if I even want to.

let campsitesArray = [];
let promotionsArray = [];
let partnersArray = [];


before(function (done) { this.timeout(3000); setTimeout(done, 2000); })
describe('API tests', function () {
    describe('GET /', function () {
        it('should return 200 and text/html', done => {
            request.get('/')
                .expect(200)
                .expect('Content-Type', /html/)
                .end(done)
        });
    });
    /*
    // Not sure how to execute this just once. Need to have a delete method for users, and clean it up after, but ... It works.
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
    describe('POST /users/login', function () {
        it(`should be able to login as user with ${JSON.stringify(testUserLogin)}`, done => {
            request.post('/users/login')
                .send(testUserLogin)
                .expect(200)
                .expect('Content-Type', /json/)
                .end((err, res) => {
                    if (err) return done(console.log(err));
                    expect(res.body).to.have.property('token');
                    userToken = res.body.token;
                    done()
                })
        })

    })
    describe('POST /users/login', function () {
        it(`should be able to login as admin with ${JSON.stringify(testAdminLogin)}`, done => {
            request.post('/users/login')
                .send(testAdminLogin)
                .expect(200)
                .expect('Content-Type', /json/)
                .end((err, res) => {
                    if (err) return done(console.log(err));
                    expect(res.body).to.have.property('token');
                    adminToken = res.body.token;
                    done()
                })
        })

    })
    describe('Campsite endpoints, not logged in', function () {
        describe('GET /campsites', function () {
            it('should return 200 in JSON for GET /campsites', done => {
                request.get('/campsites')
                    .expect(200)
                    .expect('Content-Type', /json/)
                    .end(done)
            })
        });
        describe('POST /campsites', function () {
            it('should return 401 when unauthorized POST /campsites', done => {
                request.post('/campsites')
                    .send(campsiteTest())
                    .expect(401)
                    .end(done)
            })
        })
        describe('PUT /campsites', function () {
            it('should return 401 when unauthorized PUT /campsites', done => {
                request.put('/campsites')
                    .send(campsiteTest())
                    .expect(401)
                    .end(done)
            })
        })
        describe('DELETE /campsites', function () {
            it('should return 401 when unauthorized DELETE /campsites', done => {
                request.delete('/campsites')
                    .expect(401)
                    .end(done)
            })
        })
    });
    describe('Campsite endpoints, logged in as user', function () {
        describe('GET /campsites', function () {
            it('should return 200 in JSON for GET /campsites', done => {
                request.get('/campsites')
                    .set('Authorization', `Bearer ${userToken}`)
                    .expect(200)
                    .expect('Content-Type', /json/)
                    .end(done)
            })
        });
        describe('POST /campsites', function () {
            it('should return 403 when user POST /campsites', done => {
                request.post('/campsites')
                    .set('Authorization', `Bearer ${userToken}`)
                    .send(campsiteTest())
                    .expect(403)
                    .end(done)
            })
        })
        describe('PUT /campsites', function () {
            it('should return 403 when user PUT /campsites', done => {
                request.put('/campsites')
                    .set('Authorization', `Bearer ${userToken}`)
                    .send(campsiteTest())
                    .expect(403)
                    .end(done)
            })
        })
        describe('DELETE /campsites', function () {
            it('should return 403 when user DELETE /campsites', done => {
                request.delete('/campsites')
                    .set('Authorization', `Bearer ${userToken}`)
                    .expect(403)
                    .end(done)
            })
        })
    });
    describe('Campsite endpoints, logged in as admin', function () {
        describe('GET /campsites', function () {
            it('should return 200 in JSON for GET /campsites', done => {
                request.get('/campsites')
                    .set('Authorization', `Bearer ${adminToken}`)
                    .expect(200)
                    .expect('Content-Type', /json/)
                    .end(done)
            })
        });
        describe('POST /campsites', function () {
            it(`should return 200 when user POST /campsites`, done => {
                request.post('/campsites')
                    .set('Authorization', `Bearer ${adminToken}`)
                    .send(campsiteTest())
                    .expect(200)
                    .expect('Content-Type', /json/)

                    .end((err, res) => {
                        if (err) return done(err);
                        expect(res.body).to.have.property('_id');
                        campsitesArray.push(res.body._id)
                        done();
                    })
            })
        })
        describe('PUT /campsites', function () {
            it('should return 403 when user PUT /campsites', done => {
                request.put('/campsites')
                    .set('Authorization', `Bearer ${adminToken}`)
                    .send(campsiteTest())
                    .expect(403)
                    .end(done)
            })
        })
        describe('DELETE /campsites', function () {
            it('should return 200 when user DELETE /campsites', done => {
                request.delete('/campsites')
                    .set('Authorization', `Bearer ${adminToken}`)

                    .expect(200)
                    .end((err, res) => {
                        if (err) return done(console.log(err));
                        expect(res.body).to.have.property('deletedCount');
                        done()
                    })
            })
        })
    });


    describe('GET /users/logout for user', function (done) {
        it('should redirect to /', done => {
            request.get('/users/logout')
                .set('Authorization', `Bearer ${userToken}`)
                .expect(302)
                .end((err, res) => {
                    if (err) return done(err);
                    done();
                });
        })
    })
})

after(done => {
    request.get('/users/logout')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(302)
        .end((err, res) => {
            if (err) return done(err);
            done();
        });
})


/*
        describe('GET /partners', function() { {
            it('should return 200 in JSON', done => {
                request.get('/partners')
                    .expect(200)
                    .expect('Content-Type', /json/)
                    .end(done)
            })
        });
        describe('GET /promotions', function() { {
            it('should return 200 in JSON', done => {
                request.get('/promotions')
                    .expect(200)
                    .expect('Content-Type', /json/)
                    .end(done)
            })
        });
    });

    */