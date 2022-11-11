const chai = require('chai')
const chaiHttp = require('chai-http')
const { it } = require('date-fns/locale')
const server = require('../src/server')
const should = chai.should()


describe("check out with stripe", () => {
    it("/POST request checkout", (done) => {
        let body = {
            credit: "12121212"
        }

        chai.request(server)
            .post('/api/v1/checkout')
            .send(body)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.property("success").eql(true)
                done();
            });
    })
})


describe("checkout success", () => {
    it('/GET checkout success', (done) => {
        chai.request(server)
            .get('/api/v1/checkout/success')
            .end((err, res) => {
                res.should.have.status(200)
                done()
            })
    })
})

describe("checkout cancel", () => {
    it('/GET checkout cancel', (done) => {
        chai.request(server)
            .get('/api/v1/checkout/cancel')
            .end((err, res) => {
                res.should.have.status(200)
                done()
            })
    })
})