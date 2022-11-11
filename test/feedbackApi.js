const chai = require('chai')
const chaiHttp = require('chai-http')
const { it } = require('date-fns/locale')
const server = require('../src/server')
const should = chai.should()

describe('create feedback', () => {
    it("/POST credits", (done) => {
        let body = {
            name: "yolo",
            content: "hmm",
            user: "63672e6ecd54172ca3aaaa1c"
        }
        chai.request(server)
            .post('/api/v1/feedbacks/create')
            .send(body)
            .end((err, res) => {
                res.should.have.status(200)
                res.body.should.have.a('object')
                done()
            })
    })
})

describe('all feedbacks', () => {
    it("/GET all feedbacks", (done) => {
        chai.request(server)
            .get('/api/v1/admin/feedbacks/all')
            .end((err, res) => {
                res.should.have.status(200)
                res.body.should.have.a('object')
                done()
            })
    })
})

describe('query feedbacks', () => {
    it("/GET query feedbacks", (done) => {
        const name = ""
        const content = ""
        const sortBy = ""
        const limit = ""
        const page = ""
        chai.request(server)
            .get(`/api/v1/admin/feedbacks?name=${name}&content=${content}&sortBy=${sortBy}&limit=${limit}&page=${page}`)
            .end((err, res) => {
                res.should.have.status(200)
                res.body.should.have.a('object')
                done()
            })
    })
})

describe('handle feedback by id', () => {
    it("/GET feedback by id", (done) => {
        const id = ""
        chai.request(server)
            .get(`/api/v1/admin/feedbacks/${id}`)
            .end((err, res) => {
                res.should.have.status(200)
                res.body.should.have.a('object')
                done()
            })
    })

    it("/DELETE feedback by id", (done) => {
        const id = ""
        chai.request(server)
            .delete(`/api/v1/admin/feedbacks/${id}`)
            .end((err, res) => {
                res.should.have.status(200)
                res.body.should.have.a('object')
                done()
            })
    })
})