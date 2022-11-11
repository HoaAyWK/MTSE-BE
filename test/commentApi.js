const chai = require('chai')
const chaiHttp = require('chai-http')
const { it } = require('date-fns/locale')
const server = require('../src/server')
const should = chai.should()


describe("query comments", () => {
    it("/GET query comments", (done) => {
        chai.request(server)
            .get('/api/v1/comments?user=63672e6ecd54172ca3aaaa1e')
            .end((err, res) => {
                res.should.have.status(200)
                res.body.should.hava.a('object')
                done()
            })
    })
})


describe('get comment by id', () => {
    it("/GET comment by id", (done) => {
        chai.request(server)
            .get('/api/v1/comments/id')
            .end((err, res) => {
                res.should.have.status(200)
                res.body.should.have.a('object')
                done()
            })
    })
    it('/PUT edit comment', (done) => {
        let body = {
            content: "hmm",
            stars: 0
        }
        chai.request(server)
            .put('/api/v1/comments/id')
            .send(body)
            .end((err, res) => {
                res.should.have.status(200)
                res.body.should.have.a('object')
                done()
            })
    })
})

describe('get bad comments', () => {
    it("/GET bad comments", (done) => {
        chai.request(server)
            .get('/api/v1/me/comments/nostars')
            .end((err, res) => {
                res.should.have.status(200)
                res.body.should.have.a('object')
                done()
            })
    })
})

describe('get my comments', () => {
    it("/GET my comments", (done) => {
        chai.request(server)
            .get('/api/v1/me/comments')
            .end((err, res) => {
                res.should.have.status(200)
                res.body.should.have.a('object')
                done()
            })
    })
})

describe('get comments created', () => {
    it("/GET comments created", (done) => {
        chai.request(server)
            .get('/api/v1/me/comments/created')
            .end((err, res) => {
                res.should.have.status(200)
                res.body.should.have.a('object')
                done()
            })
    })
})