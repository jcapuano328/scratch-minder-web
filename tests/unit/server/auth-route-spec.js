'use strict';
var chai = require('chai'),
	expect = chai.expect,
	sinon = require('sinon'),
	sandbox = require('sandboxed-module'),
    _ = require('lodash');
chai.use(require('sinon-chai'));

describe('Auth route', () => {
	var env = {};
	let response = (status, statusText, bodyjson, bodystr) => {
		return {
			status: status,
			statusText: statusText,
			json() {
				return bodyjson;
			},
			text() {
				return bodystr;
			}
		};
	}

	beforeEach(() => {
		env = {};
        env.log = sandbox.require('../../mocks/log')();
		env.fetch = sinon.stub();
		env.jwt = {
			sign: sinon.stub()
		};
		env.config = {
			session: {
				secret: 'secret'
			},
			services: {
				host: 'http://host:port',
				auth: {
					login: '/path/to/login',
					grant: '/path/to/grant'
				}
			}
		};
		env.req = {};
        env.res = {
			status: sinon.stub(),
            send: sinon.stub()
        };
		env.res.status.returns(env.res);
		env.res.send.returns(env.res);
        env.next = sinon.stub();

		env.user = {
            username: 'foo',
			firstname: 'fname',
			lastname: 'lname'
        };
		env.authtoken = {
			access_token: 'token987'
		};
		env.token = 'def123ghi567';

        env.routes = sandbox.require('../../../src/server/routes/auth', {
            requires: {
				'config': env.config,
				'node-fetch': env.fetch,
				'jsonwebtoken': env.jwt,
                '../lib/log': env.log
            }
        });
    });

    describe('interface', () => {
        it('should have a 2 routes', () => {
            expect(env.routes).to.be.an.array;
            expect(env.routes).to.have.length(2);
        });
        describe('login', () => {
            beforeEach(() => {
                env.route = env.routes[0];
            });
            it('should have a method', () => {
                expect(env.route).to.have.property('method', 'post');
            });
            it('should have a uri', () => {
                expect(env.route).to.have.property('uri', '/login');
            });
            it('should not be protected', () => {
                expect(env.route).to.have.property('protected', false);
            });
            it('should have a handler', () => {
                expect(env.route).to.respondTo('handler');
            });
        });
        describe('logout', () => {
            beforeEach(() => {
                env.route = env.routes[1];
            });
            it('should have a method', () => {
                expect(env.route).to.have.property('method', 'post');
            });
            it('should have a uri', () => {
                expect(env.route).to.have.property('uri', '/logout');
            });
            it('should not be protected', () => {
                expect(env.route).to.have.property('protected', false);
            });
            it('should have a handler', () => {
                expect(env.route).to.respondTo('handler');
            });
        });
    });

    describe('handlers', () => {
        describe('login', () => {
            beforeEach(() => {
                env.handler = env.routes[0].handler;
            });

            describe('success', () => {
                beforeEach((done) => {
                    env.req.body = {
						username: 'user123',
						password: 'abc123'
					};
                    env.fetch.onFirstCall().returns(Promise.accept(response(200, 'OK', env.user)));
					env.fetch.onSecondCall().returns(Promise.accept(response(201, 'OK', env.authtoken)));
					env.jwt.sign.yields(env.token);
                    env.handler(env.req,env.res,env.next)
                    .then(() => {done();})
                    .catch(done);
                });
                it('should invoke the login service', () => {
                    expect(env.fetch).to.have.been.calledWith(env.config.services.host + env.config.services.auth.login, {
	                    method: 'POST',
	                    headers: {
	                        'Accept': 'application/json',
	                        'Content-Type': 'application/json'
	                    },
	                    body: JSON.stringify({username: env.req.body.username, password: env.req.body.password})
	                });
                });
				it('should invoke the grant service', () => {
                    expect(env.fetch).to.have.been.calledWith(env.config.services.host + env.config.services.auth.grant, {
	                    method: 'POST',
	                    headers: {
	                        'Accept': 'application/json',
	                        'Content-Type': 'application/x-www-form-urlencoded'
	                    },
	                    body: 'grant_type=password&username='+env.user.username+'&password='+env.req.body.password
	                });
                });
				it('should generate the jwt', () => {
					expect(env.jwt.sign).to.have.been.calledOnce;
					expect(env.jwt.sign).to.have.been.calledWith({user: env.user, token: env.authtoken.access_token}, env.config.session.secret);
				});
                it('should return created to the caller', () => {
					expect(env.res.status).to.have.been.calledOnce;
                    expect(env.res.status).to.have.been.calledWith(200);

                    expect(env.res.send).to.have.been.calledOnce;
                    expect(env.res.send).to.have.been.calledWith(env.token);
                });
            });

			describe('missing username', () => {
                beforeEach((done) => {
                    env.req.body = {
						password: 'abc123'
					};
                    env.handler(env.req,env.res,env.next)
                    .then(() => {done();})
                    .catch(done);
                });
                it('should not invoke the login service', () => {
                    expect(env.fetch).to.not.have.been.calledWith(env.config.services.host + env.config.services.auth.login);
                });
				it('should not invoke the grant service', () => {
                    expect(env.fetch).to.not.have.been.calledWith(env.config.services.host + env.config.services.auth.grant);
                });
				it('should not generate the jwt', () => {
					expect(env.jwt.sign).to.not.have.been.calledOnce;
				});
                it('should return failure to the caller', () => {
					expect(env.res.status).to.have.been.calledOnce;
                    expect(env.res.status).to.have.been.calledWith(401);

                    expect(env.res.send).to.have.been.calledOnce;
                    expect(env.res.send).to.have.been.calledWith('Credentials misssing');
                });
            });

			describe('missing password', () => {
                beforeEach((done) => {
                    env.req.body = {
						username: 'user123'
					};
                    env.handler(env.req,env.res,env.next)
                    .then(() => {done();})
                    .catch(done);
                });
                it('should not invoke the login service', () => {
                    expect(env.fetch).to.not.have.been.calledWith(env.config.services.host + env.config.services.auth.login);
                });
				it('should not invoke the grant service', () => {
                    expect(env.fetch).to.not.have.been.calledWith(env.config.services.host + env.config.services.auth.grant);
                });
				it('should not generate the jwt', () => {
					expect(env.jwt.sign).to.not.have.been.calledOnce;
				});
                it('should return failure to the caller', () => {
					expect(env.res.status).to.have.been.calledOnce;
                    expect(env.res.status).to.have.been.calledWith(401);

                    expect(env.res.send).to.have.been.calledOnce;
                    expect(env.res.send).to.have.been.calledWith('Credentials misssing');
                });
            });

			describe('login failed', () => {
                beforeEach((done) => {
                    env.req.body = {
						username: 'user123',
						password: 'abc123'
					};
                    env.fetch.onFirstCall().returns(Promise.accept(response(401, 'User not authenticated')));
                    env.handler(env.req,env.res,env.next)
                    .then(() => {done();})
                    .catch(done);
                });
                it('should invoke the login service', () => {
                    expect(env.fetch).to.have.been.calledWith(env.config.services.host + env.config.services.auth.login, {
	                    method: 'POST',
	                    headers: {
	                        'Accept': 'application/json',
	                        'Content-Type': 'application/json'
	                    },
	                    body: JSON.stringify({username: env.req.body.username, password: env.req.body.password})
	                });
                });
				it('should not invoke the grant service', () => {
                    expect(env.fetch).not.to.have.been.calledWith(env.config.services.host + env.config.services.auth.grant);
                });
				it('should not generate the jwt', () => {
					expect(env.jwt.sign).to.not.have.been.called;
				});
                it('should return failure to the caller', () => {
					expect(env.res.status).to.have.been.calledOnce;
                    expect(env.res.status).to.have.been.calledWith(401);

                    expect(env.res.send).to.have.been.calledOnce;
                    expect(env.res.send).to.have.been.calledWith('User not authenticated');
                });
            });

			describe('token not granted', () => {
                beforeEach((done) => {
                    env.req.body = {
						username: 'user123',
						password: 'abc123'
					};
                    env.fetch.onFirstCall().returns(Promise.accept(response(200, 'OK', env.user)));
					env.fetch.onSecondCall().returns(Promise.accept(response(401, 'Token not granted')));
                    env.handler(env.req,env.res,env.next)
                    .then(() => {done();})
                    .catch(done);
                });
                it('should invoke the login service', () => {
                    expect(env.fetch).to.have.been.calledWith(env.config.services.host + env.config.services.auth.login, {
	                    method: 'POST',
	                    headers: {
	                        'Accept': 'application/json',
	                        'Content-Type': 'application/json'
	                    },
	                    body: JSON.stringify({username: env.req.body.username, password: env.req.body.password})
	                });
                });
				it('should invoke the grant service', () => {
                    expect(env.fetch).to.have.been.calledWith(env.config.services.host + env.config.services.auth.grant, {
	                    method: 'POST',
	                    headers: {
	                        'Accept': 'application/json',
	                        'Content-Type': 'application/x-www-form-urlencoded'
	                    },
	                    body: 'grant_type=password&username='+env.user.username+'&password='+env.req.body.password
	                });
                });
				it('should not.generate the jwt', () => {
					expect(env.jwt.sign).to.not.have.been.called;
				});
                it('should return failure to the caller', () => {
					expect(env.res.status).to.have.been.calledOnce;
                    expect(env.res.status).to.have.been.calledWith(401);

                    expect(env.res.send).to.have.been.calledOnce;
                    expect(env.res.send).to.have.been.calledWith('Token not granted');
                });
            });
        });

        describe('logout', () => {
            beforeEach(() => {
                env.handler = env.routes[1].handler;
            });

            describe('success', () => {
                beforeEach(() => {
                    env.handler(env.req,env.res,env.next);
                });
				it('should invoke the next middleware', () => {
                    expect(env.next).to.have.been.calledOnce;
                });
            });
        });
    });
});
