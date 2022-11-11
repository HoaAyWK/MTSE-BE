const chai = require('chai')
const chaiHttp = require('chai-http')
const { it } = require('date-fns/locale')
const server = require('../src/server')
const should = chai.should()

describe('query jobs', () => {
    it("/GET query feedbacks", (done) => {
        const name = ""
        const status = ""
        const sortBy = ""
        const limit = ""
        const page = ""
        chai.request(server)
            .get(`/api/v1/jobs?name=${name}&status=${status}&sortBy=${sortBy}&limit=${limit}&page=${page}`)
            .end((err, res) => {
                res.should.have.status(200)
                res.body.should.have.a('object')
                done()
            })
    })
})

describe('handle job by id', () => {
    it("/GET job by id", (done) => {
        const id = ""
        chai.request(server)
            .get(`/api/v1/jobs/${id}`)
            .end((err, res) => {
                res.should.have.status(200)
                res.body.should.have.a('object')
                done()
            })
    })

    it("/DELETE job by id", (done) => {
        const id = ""
        chai.request(server)
            .delete(`/api/v1/jobs/${id}`)
            .end((err, res) => {
                res.should.have.status(200)
                res.body.should.have.a('object')
                done()
            })
    })
})


describe('get my current jobs', () => {
    it("/GET query feedbacks", (done) => {
        chai.request(server)
            .get(`/api/v1/my/jobs`)
            .end((err, res) => {
                res.should.have.status(200)
                res.body.should.have.a('object')
                done()
            })
    })
})

