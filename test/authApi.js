const chai = require('chai')
const chaiHttp = require('chai-http')
const { it } = require('date-fns/locale')
const server = require('../src/server')
const should = chai.should()


chai.use(chaiHttp)


// login
describe('/POST login', () => {
    it('login by admin', (done) => {
        let body = {
            email: "admin@gmail.com",
            password: "123456"
        };
        chai.request(server)
            .post('/api/v1/login')
            .send(body)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.property("success").eql(true)
                done();
            });
    });

    it('/POST login user freelancer', (done) => {
        let body = {
            email: "freelancer@gmail.com",
            password: "123456"
        }

        chai.request(server)
            .post('/api/v1/login')
            .send(body)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.property("success").eql(true)
                done();
            });
    })

    it('/POST login user not found - error email', (done) => {
        let body = {
            email: "admin111@gmail.com",
            password: "123456"
        }

        chai.request(server)
            .post('/api/v1/login')
            .send(body)
            .end((err, res) => {
                res.should.have.status(400)
                res.body.should.have.a('object')
                res.body.should.property("success").eql(false)
                res.body.should.property('message').eql("Incorrect Email or Password")
                done()
            })
    })

    it('/POST login user not found - error password', (done) => {
        let body = {
            email: "admin@gmail.com",
            password: "12345dfsdfsdfdsfsds6"
        }

        chai.request(server)
            .post('/api/v1/login')
            .send(body)
            .end((err, res) => {
                res.should.have.status(400)
                res.body.should.have.a('object')
                res.body.should.property("success").eql(false)
                res.body.should.property('message').eql("Incorrect Email or Password")
                done()
            })
    })
});


// register
describe("/POST register user", ()=>{
    it('/POST register success', (done) => {
        let body = {
            email: "tri@gmail.com",
            password: '123456',
            name: "tri",
            phone: "923232323"
        }


        chai.request(server)
            .post('/api/v1/register')
            .send(body)
            .end((err, res) => {
                res.should.status(200)
                res.body.should.have.a('object')
                res.body.should.property('success').eql(true)
                done()
            })
    })

    it('/POST register failed - existed email', (done)=> {
        let body = {
            email: "admin@gmail.com",
            password: '12345d6',
            name: "tri",
            phone: "923232323"
        }


        chai.request(server)
            .post('/api/v1/register')
            .send(body)
            .end((err, res) => {
                res.should.status(400)
                res.body.should.have.a('object')
                res.body.should.property('success').eql(false)
                done()
            })
    })
})

// confirm email
describe("comfirm email", () => {
    it("/GET - confirm email success", (done) => {

        chai.request(server)
            .get('/api/v1//email/confirm/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2MzZkZGEyZmYyZjk0ZDhkZTc4NjViZWIiLCJpYXQiOjE2NjgxNDQwMjAsImV4cCI6MTY2ODE0NTgyMCwidHlwZSI6InZlcmlmeUVtYWlsIn0.kfVpW8MWPrF5hZU1pZDBYNb45KM89C0dsDUuW1rFPy4')
            .send(body)
            .end((err, res) => {
                res.should.status(200)
                res.body.should.have.a('object')
                res.body.should.property('success').eql(true)
                done()
            })

    })


    it("/GET - confirm email failed - invalid token", (done) => {

        chai.request(server)
            .get('/api/v1/email/confirm/eyJhbGciOasdfasdafadsfiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2MzZkZGEyZmYyZjk0ZDhkZTc4NjViZWIiLCJpYXQiOjE2NjgxNDQwMjAsImV4cCI6MTY2ODE0NTgyMCwidHlwZSI6InZlcmlmeUVtYWlsIn0.kfVpW8MWPrF5hZU1pZDBYNb45KM89C0dsDUuW1rFPy4')
            .send(body)
            .end((err, res) => {
                res.should.status(400)
                res.body.should.have.a('object')
                res.body.should.property('success').eql(false)
                done()
            })

    })
})

describe('forgot password', () => {
    it('/POST request forgot success', (done) => {
        let body = {
            email: "tri@gmail.com"
        }

        chai.request(server)
            .post('/api/v1/password/forgot')
            .send(body)
            .end((err, res) => {
                res.should.status(200)
                res.body.should.have.a('object')
                res.body.should.property('success').eql(true)
                done()
            })
    })

    it('/POST request forgot failed - invalid email', (done) => {
        let body = {
            email: "tri121212112@gmail.com"
        }

        chai.request(server)
            .post('/api/v1/password/forgot')
            .send(body)
            .end((err, res) => {
                res.should.status(400)
                res.body.should.have.a('object')
                res.body.should.property('success').eql(false)
                done()
            })
    })

})


describe('reset password', () => {
    it('/PUT reset password success', (done) => {
        let body = {
            password: "121212121212",
            confirmPassword: "121212121212"
        }

        chai.request(server)
            .post('/api/v1/password/reset/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2MzY4NzA5ZGU5MzM0ODBiZWI1ZTI4YzkiLCJpYXQiOjE2Njc3ODg5NTcsImV4cCI6MTY2Nzc5MDc1NywidHlwZSI6InZlcmlmeUVtYWlsIn0.7E57nkvrFsj8D7T7AjU2ItrzXaCx2nY6TAo514lkPwI')
            .send(body)
            .end((err, res) => {
                res.should.status(200)
                res.body.should.have.a('object')
                res.body.should.property('success').eql(true)
                done()
            })
    })

    it('/PUT reset password failed - invalid token', (done) => {
        let body = {
            password: "121212121212",
            confirmPassword: "121212121212"
        }

        chai.request(server)
            .post('/api/v1/password/reset/eyJhddddbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2MzY4NzA5ZGU5MzM0ODBiZWI1ZTI4YzkiLCJpYXQiOjE2Njc3ODg5NTcsImV4cCI6MTY2Nzc5MDc1NywidHlwZSI6InZlcmlmeUVtYWlsIn0.7E57nkvrFsj8D7T7AjU2ItrzXaCx2nY6TAo514lkPwI')
            .send(body)
            .end((err, res) => {
                res.should.status(400)
                res.body.should.have.a('object')
                res.body.should.property('success').eql(false)
                done()
            })
    })

    it('/PUT reset password failed - unmatched 2 password', (done) => {
        let body = {
            password: "121212121212",
            confirmPassword: "121212121212"
        }

        chai.request(server)
            .post('/api/v1/password/reset/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2MzY4NzA5ZGU5MzM0ODBiZWI1ZTI4YzkiLCJpYXQiOjE2Njc3ODg5NTcsImV4cCI6MTY2Nzc5MDc1NywidHlwZSI6InZlcmlmeUVtYWlsIn0.7E57nkvrFsj8D7T7AjU2ItrzXaCx2nY6TAo514lkPwI')
            .send(body)
            .end((err, res) => {
                res.should.status(400)
                res.body.should.have.a('object')
                res.body.should.property('success').eql(false)
                done()
            })
    })
})




