'use strict';
var chai = require('chai'),
	expect = chai.expect,
	sinon = require('sinon'),
	sandbox = require('sandboxed-module'),
    _ = require('lodash');
chai.use(require('sinon-chai'));

describe('Auth Middleware', () => {
	var env = {};
	beforeEach(() => {
		env = {};
        env.log = sandbox.require('../../mocks/log')();
		env.fetch = sinon.stub();

		env.config = {
			services: {
				host: 'http://host:port',
				auth: {
					verify: '/path/to/verify'
				}
			}
		};
		env.req = {
			user: {}
        };
        env.res = {
			status: sinon.stub(),
            send: sinon.stub()
        };
		env.res.status.returns(env.res);
		env.res.send.returns(env.res);
        env.next = sinon.stub();

        env.auth = sandbox.require('../../../src/server/lib/auth', {
            requires: {
				'config': env.config,
                'node-fetch': env.fetch,
                '../lib/log': env.log
            }
        });
    });

    describe('restricted', () => {
        beforeEach(() => {
            env.handler = env.auth(true);
        });

        describe('success', () => {
            beforeEach((done) => {
				env.req.user.token = 'abc123';
                env.fetch.returns(Promise.accept({status: 200}));

                env.handler(env.req,env.res,env.next)
                .then(() => {done();})
                .catch(done);
            });
            it('should invoke the service', () => {
                expect(env.fetch).to.have.been.calledOnce;
                expect(env.fetch).to.have.been.calledWith(env.config.services.host + env.config.services.auth.verify, sinon.match({
					method: 'POST',
					headers: {
		                'Accept': 'application/json',
		                'Content-Type': 'application/json'
		            },
					body: JSON.stringify({access_token: env.req.user.token})
				}));
            });
            it('should call the next middleware', () => {
                expect(env.next).to.have.been.calledOnce;
            });
            it('should not return a response to the caller', () => {
				expect(env.res.status).to.not.have.been.called;
                expect(env.res.send).to.not.have.been.called;
            });
        });

        describe('token missing', () => {
            beforeEach((done) => {
				env.handler(env.req,env.res,env.next)
				.then(done)
                .catch(() => { done();});
            });
			it('should not invoke the service', () => {
                expect(env.fetch).to.not.have.been.called;
            });
            it('should not call the next middleware', () => {
                expect(env.next).to.not.have.been.called;
            });
            it('should return a response to the caller', () => {
				expect(env.res.status).to.have.been.calledOnce;
				expect(env.res.status).to.have.been.calledWith(401);

                expect(env.res.send).to.have.been.calledOnce;
				expect(env.res.send).to.have.been.calledWith('Invalid credentials');
            });
        });

		describe('invalid token', () => {
            beforeEach((done) => {
				env.req.user.token = 'abc123';
                env.fetch.returns(Promise.reject({status: 401}));

                env.handler(env.req,env.res,env.next)
                .then(() => {done();})
                .catch(done);
            });
            it('should invoke the service', () => {
                expect(env.fetch).to.have.been.calledOnce;
                expect(env.fetch).to.have.been.calledWith(env.config.services.host + env.config.services.auth.verify, sinon.match({
					method: 'POST',
					headers: {
		                'Accept': 'application/json',
		                'Content-Type': 'application/json'
		            },
					body: JSON.stringify({access_token: env.req.user.token})
				}));
            });
            it('should not call the next middleware', () => {
                expect(env.next).to.not.have.been.called;
            });
			it('should return a response to the caller', () => {
				expect(env.res.status).to.have.been.calledOnce;
				expect(env.res.status).to.have.been.calledWith(401);

                expect(env.res.send).to.have.been.calledOnce;
				expect(env.res.send).to.have.been.calledWith('Token invalid');
            });
        });
    });

	describe('unrestricted', () => {
        beforeEach((done) => {
			env.handler = env.auth(false);
            env.handler(env.req,env.res,env.next)
            .then(() => {done();})
            .catch(done);
        });
        it('should not invoke the service', () => {
            expect(env.fetch).to.not.have.been.called;
        });
        it('should call the next middleware', () => {
            expect(env.next).to.have.been.calledOnce;
        });
        it('should not return a response to the caller', () => {
			expect(env.res.status).to.not.have.been.called;
            expect(env.res.send).to.not.have.been.called;
        });
	});
});
