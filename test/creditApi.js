const chai = require('chai')
const chaiHttp = require('chai-http')
const { it } = require('date-fns/locale')
const server = require('../src/server')
const should = chai.should()


describe('get credits', () => {
    it("/GET credits", (done) => {
        chai.request(server)
            .get('/api/v1/credits')
            .end((err, res) => {
                res.should.have.status(200)
                res.body.should.have.a('object')
                done()
            })
    })
})


describe('get credit by id', () => {
    it("/GET credit by id", (done) => {
        chai.request(server)
            .get('/api/v1/credits/id')
            .end((err, res) => {
                res.should.have.status(200)
                res.body.should.have.a('object')
                done()
            })
    })
})

describe('create credit', () => {
    it("/POST create credit", (done) => {
        let body = {
            name: "yolo",
            price: "50000",
            points: '500'
        }
        chai.request(server)
            .post('/api/v1/admin/credits/create')
            .send(body)
            .end((err, res) => {
                res.should.have.status(200)
                res.body.should.have.a('object')
                done()
            })
    })
})

describe('delete credit', () => {
    it("/DELETE credit", (done) => {
        const id = ""
        chai.request(server)
            .delete(`/api/v1/admin/credits/${id}`)
            .end((err, res) => {
                res.should.have.status(200)
                res.body.should.have.a('object')
                done()
            })
    })
})