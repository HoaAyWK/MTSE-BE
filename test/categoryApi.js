const chai = require('chai')
const chaiHttp = require('chai-http')
const { it } = require('date-fns/locale')
const server = require('../src/server')
const should = chai.should()


chai.use(chaiHttp)

describe('create category', () => {
    it('create category success', (done) => {
        let body = {
            name: "Deep Learning",
            children: []
        };
        chai.request(server)
            .post('/api/v1/admin/categories/create')
            .send(body)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.property("success").eql(true)
                done();
            });
    });

    it('create category failed - existed category name', (done) => {
        let body = {
            name: "Deep Learning",
            children: []
        };
        chai.request(server)
            .post('/api/v1/admin/categories/create')
            .send(body)
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.be.a('object');
                res.body.should.property("success").eql(false)
                done();
            });
    });
});


describe('get categories', () => {
    it('get all categories', (done) => {
        let body = {
            name: "Deep Learning",
            children: []
        };
        chai.request(server)
            .post('/api/v1/admin/categories')
            .send(body)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.property("success").eql(true)
                done();
            });
    });
});

describe('category handle', () => {
    it('/PUT - edit category', (done) => {
        let body = {
            name: "Deep Learning 2",
            children: []
        };
        chai.request(server)
            .post('/api/v1/admin/categories/63673269f4f9927d8c4f5dc7')
            .send(body)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                
                res.body.should.property("success").eql(true)
                done();
            });
    });

    it('/DELETE - delete category', (done) => {
        chai.request(server)
            .delete('/api/v1/admin/categories/63673269f4f9927d8c4f5dc7')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.property("success").eql(true)
                done();
            });
    });
});


