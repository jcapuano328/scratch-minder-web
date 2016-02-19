'use strict';
var chai = require('chai'),
	expect = chai.expect,
	sinon = require('sinon'),
	sandbox = require('sandboxed-module'),
    _ = require('lodash');
chai.use(require('sinon-chai'));

describe('Accounts route', () => {
	var env = {};
	beforeEach(() => {
		env = {};
        env.log = sandbox.require('../../mocks/log')();
		env.response = sandbox.require('../../mocks/response');
		env.fetch = sinon.stub();

		env.config = {
			services: {
				host: 'http://host:port',
				accounts: {
					accounts: '/users/:userid/path/to/accounts',
					account: '/users/:userid/path/to/account/:id'
				}
			}
		};

		env.req = {
			user: {
				user: {
					userid: 'user123'
				},
				token: 'token987'
			}
		};
        env.res = {
			status: sinon.stub(),
            send: sinon.stub()
        };
		env.res.status.returns(env.res);
		env.res.send.returns(env.res);
        env.next = sinon.stub();

        env.routes = sandbox.require('../../../src/server/routes/accounts', {
            requires: {
				'config': env.config,
				'node-fetch': env.fetch,
                '../lib/log': env.log
            }
        });
    });

    describe('interface', () => {
        it('should have a 5 routes', () => {
            expect(env.routes).to.be.an.array;
            expect(env.routes).to.have.length(5);
        });
        describe('get all accounts', () => {
            beforeEach(() => {
                env.route = env.routes[0];
            });
            it('should have a method', () => {
                expect(env.route).to.have.property('method', 'get');
            });
            it('should have a uri', () => {
                expect(env.route).to.have.property('uri', '/accounts');
            });
            it('should be protected', () => {
                expect(env.route).to.have.property('protected', true);
            });
            it('should have a handler', () => {
                expect(env.route).to.respondTo('handler');
            });
        });
        describe('get an account', () => {
            beforeEach(() => {
                env.route = env.routes[1];
            });
            it('should have a method', () => {
                expect(env.route).to.have.property('method', 'get');
            });
            it('should have a uri', () => {
                expect(env.route).to.have.property('uri', '/accounts/:id');
            });
            it('should be protected', () => {
                expect(env.route).to.have.property('protected', true);
            });
            it('should have a handler', () => {
                expect(env.route).to.respondTo('handler');
            });
        });
        describe('create account', () => {
            beforeEach(() => {
                env.route = env.routes[2];
            });
            it('should have a method', () => {
                expect(env.route).to.have.property('method', 'post');
            });
            it('should have a uri', () => {
                expect(env.route).to.have.property('uri', '/accounts');
            });
            it('should be protected', () => {
                expect(env.route).to.have.property('protected', true);
            });
            it('should have a handler', () => {
                expect(env.route).to.respondTo('handler');
            });
        });
        describe('update account', () => {
            beforeEach(() => {
                env.route = env.routes[3];
            });
            it('should have a method', () => {
                expect(env.route).to.have.property('method', 'put');
            });
            it('should have a uri', () => {
                expect(env.route).to.have.property('uri', '/accounts/:id');
            });
            it('should be protected', () => {
                expect(env.route).to.have.property('protected', true);
            });
            it('should have a handler', () => {
                expect(env.route).to.respondTo('handler');
            });
        });
		describe('delete account', () => {
            beforeEach(() => {
                env.route = env.routes[4];
            });
            it('should have a method', () => {
                expect(env.route).to.have.property('method', 'delete');
            });
            it('should have a uri', () => {
                expect(env.route).to.have.property('uri', '/accounts/:id');
            });
            it('should be protected', () => {
                expect(env.route).to.have.property('protected', true);
            });
            it('should have a handler', () => {
                expect(env.route).to.respondTo('handler');
            });
        });
	});

	describe('handlers', () => {
		beforeEach(() => {
			env.accounts = [
				{
					"accountid": 'abc123',
					"number": '44444',
					"name": 'ipsom lorem',
					"sequence": '5986',
					"balance": 5963.36
				},
				{
					"accountid": 'abc456',
					"number": '98709788',
					"name": 'off shore savings',
					"sequence": '9999',
					"balance": 5963.36
				}
			];
		});

		describe('get all', () => {
			beforeEach(() => {
				env.handler = env.routes[0].handler;
			});

			describe('success', () => {
				beforeEach((done) => {
					env.fetch.returns(Promise.accept(env.response(200, 'OK', env.accounts)));
                    env.handler(env.req,env.res,env.next)
                    .then(() => {done();})
                    .catch(done);
				});

				it('should call the service', () => {
					expect(env.fetch).to.have.been.calledOnce;
					expect(env.fetch).to.have.been.calledWith('http://host:port/users/user123/path/to/accounts', {
						method: 'GET',
						headers: {
		                    'Accept': 'application/json',
		                    'Content-Type': 'application/json',
		                    'Authorization': 'Bearer ' + env.req.user.token
		                }
					});
				});

				it('should return 200', () => {
					expect(env.res.status).to.have.been.calledOnce;
					expect(env.res.status).to.have.been.calledWith(200);
				});
				it('should return the data', () => {
					expect(env.res.send).to.have.been.calledOnce;
					expect(env.res.send).to.have.been.calledWith(env.accounts);
				});
			});
		});

		describe('get', () => {
			beforeEach(() => {
				env.handler = env.routes[1].handler;
			});

			describe('success', () => {
				beforeEach((done) => {
					env.req.params = {
						id: 'account123'
					};
					env.fetch.returns(Promise.accept(env.response(200, 'OK', env.accounts[0])));
                    env.handler(env.req,env.res,env.next)
                    .then(() => {done();})
                    .catch(done);
				});

				it('should call the service', () => {
					expect(env.fetch).to.have.been.calledOnce;
					expect(env.fetch).to.have.been.calledWith('http://host:port/users/user123/path/to/account/account123', {
						method: 'GET',
						headers: {
		                    'Accept': 'application/json',
		                    'Content-Type': 'application/json',
		                    'Authorization': 'Bearer ' + env.req.user.token
		                }
					});
				});

				it('should return 200', () => {
					expect(env.res.status).to.have.been.calledOnce;
					expect(env.res.status).to.have.been.calledWith(200);
				});
				it('should return the data', () => {
					expect(env.res.send).to.have.been.calledOnce;
					expect(env.res.send).to.have.been.calledWith(env.accounts[0]);
				});
			});
		});
	});
});
