'use strict';
var chai = require('chai'),
	expect = chai.expect,
	sinon = require('sinon'),
	sandbox = require('sandboxed-module'),
    _ = require('lodash');
chai.use(require('sinon-chai'));

describe('Transactions route', () => {
	var env = {};
	beforeEach(() => {
		env = {};
        env.log = sandbox.require('../../mocks/log')();
		env.response = sandbox.require('../../mocks/response');
		env.fetch = sinon.stub();

		env.config = {
			services: {
				host: 'http://host:port',
				transactions: {
					transactions: '/users/:userid/path/to/account/:accountid/transactions',
					transaction: '/users/:userid/path/to/account/:accountid/transactions/:id',
					transactionsearch: '/users/:userid/path/to/account/:accountid/transactions/search/:kind/:search'
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

        env.routes = sandbox.require('../../../src/server/routes/transactions', {
            requires: {
				'config': env.config,
				'node-fetch': env.fetch,
                '../lib/log': env.log
            }
        });
    });

    describe('interface', () => {
        it('should have a 7 routes', () => {
            expect(env.routes).to.be.an.array;
            expect(env.routes).to.have.length(7);
        });
        describe('get all transactions for an account', () => {
            beforeEach(() => {
                env.route = env.routes[0];
            });
            it('should have a method', () => {
                expect(env.route).to.have.property('method', 'get');
            });
            it('should have a uri', () => {
                expect(env.route).to.have.property('uri', '/accounts/:accountid/transactions');
            });
            it('should be protected', () => {
                expect(env.route).to.have.property('protected', true);
            });
            it('should have a handler', () => {
                expect(env.route).to.respondTo('handler');
            });
        });
        describe('get a transaction for an account', () => {
            beforeEach(() => {
                env.route = env.routes[1];
            });
            it('should have a method', () => {
                expect(env.route).to.have.property('method', 'get');
            });
            it('should have a uri', () => {
                expect(env.route).to.have.property('uri', '/accounts/:accountid/transactions/:id');
            });
            it('should be protected', () => {
                expect(env.route).to.have.property('protected', true);
            });
            it('should have a handler', () => {
                expect(env.route).to.respondTo('handler');
            });
        });
        describe('create transaction', () => {
            beforeEach(() => {
                env.route = env.routes[2];
            });
            it('should have a method', () => {
                expect(env.route).to.have.property('method', 'post');
            });
            it('should have a uri', () => {
                expect(env.route).to.have.property('uri', '/accounts/:accountid/transactions');
            });
            it('should be protected', () => {
                expect(env.route).to.have.property('protected', true);
            });
            it('should have a handler', () => {
                expect(env.route).to.respondTo('handler');
            });
        });
        describe('update transaction', () => {
            beforeEach(() => {
                env.route = env.routes[3];
            });
            it('should have a method', () => {
                expect(env.route).to.have.property('method', 'put');
            });
            it('should have a uri', () => {
                expect(env.route).to.have.property('uri', '/accounts/:accountid/transactions/:id');
            });
            it('should be protected', () => {
                expect(env.route).to.have.property('protected', true);
            });
            it('should have a handler', () => {
                expect(env.route).to.respondTo('handler');
            });
        });
		describe('delete transaction', () => {
            beforeEach(() => {
                env.route = env.routes[4];
            });
            it('should have a method', () => {
                expect(env.route).to.have.property('method', 'delete');
            });
            it('should have a uri', () => {
                expect(env.route).to.have.property('uri', '/accounts/:accountid/transactions/:id');
            });
            it('should be protected', () => {
                expect(env.route).to.have.property('protected', true);
            });
            it('should have a handler', () => {
                expect(env.route).to.respondTo('handler');
            });
        });
		describe('search transactions', () => {
            beforeEach(() => {
                env.route = env.routes[5];
            });
            it('should have a method', () => {
                expect(env.route).to.have.property('method', 'get');
            });
            it('should have a uri', () => {
                expect(env.route).to.have.property('uri', '/accounts/:accountid/transactions/search/:kind/:search');
            });
            it('should be protected', () => {
                expect(env.route).to.have.property('protected', true);
            });
            it('should have a handler', () => {
                expect(env.route).to.respondTo('handler');
            });
        });
		describe('transactions range', () => {
            beforeEach(() => {
                env.route = env.routes[6];
            });
            it('should have a method', () => {
                expect(env.route).to.have.property('method', 'get');
            });
            it('should have a uri', () => {
                expect(env.route).to.have.property('uri', '/accounts/:accountid/transactions/startdate/:startdate/enddate/:enddate');
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
			env.transactions = [
				{
				    "transactionid": '1',
				    "accountid": 'abc123',
				    "type": 'debit',
				    "sequence": '3257',
				    "category": 'Household',
				    "description": 'Piggly Wiggly',
				    "amount": 56.98,
				    "when": new Date()
				},
				{
				    "transactionid": '3',
				    "accountid": 'abc123',
				    "type": 'debit',
				    "sequence": '3258',
				    "category": 'Taxes',
				    "description": 'IRS',
				    "amount": 2589.85,
				    "when": new Date()
				}
			];
		});

		describe('get all', () => {
			beforeEach(() => {
				env.handler = env.routes[0].handler;
			});

			describe('success', () => {
				beforeEach((done) => {
					env.req.params = {
						accountid: 'abc123'
					};
					env.fetch.returns(Promise.accept(env.response(200, 'OK', env.transactions)));
                    env.handler(env.req,env.res,env.next)
                    .then(() => {done();})
                    .catch(done);
				});

				it('should call the service', () => {
					expect(env.fetch).to.have.been.calledOnce;
					expect(env.fetch).to.have.been.calledWith('http://host:port/users/user123/path/to/account/abc123/transactions', {
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
					expect(env.res.send).to.have.been.calledWith(env.transactions);
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
						accountid: 'abc123',
						id: '3'
					};
					env.fetch.returns(Promise.accept(env.response(200, 'OK', env.transactions[0])));
                    env.handler(env.req,env.res,env.next)
                    .then(() => {done();})
                    .catch(done);
				});

				it('should call the service', () => {
					expect(env.fetch).to.have.been.calledOnce;
					expect(env.fetch).to.have.been.calledWith('http://host:port/users/user123/path/to/account/abc123/transactions/3', {
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
					expect(env.res.send).to.have.been.calledWith(env.transactions[0]);
				});
			});
		});

		describe('post', () => {
			beforeEach(() => {
				env.handler = env.routes[2].handler;
			});

			describe('success', () => {
				beforeEach((done) => {
					env.req.params = {
						accountid: 'abc123'
					};
					env.req.body = env.transactions[0];
					env.fetch.returns(Promise.accept(env.response(201, 'OK', env.transactions[0])));
					env.handler(env.req,env.res,env.next)
					.then(() => {done();})
					.catch(done);
				});

				it('should call the service', () => {
					expect(env.fetch).to.have.been.calledOnce;
					expect(env.fetch).to.have.been.calledWith('http://host:port/users/user123/path/to/account/abc123/transactions', {
						method: 'POST',
						headers: {
							'Accept': 'application/json',
							'Content-Type': 'application/json',
							'Authorization': 'Bearer ' + env.req.user.token
						},
						body: JSON.stringify(env.transactions[0])
					});
				});

				it('should return 201', () => {
					expect(env.res.status).to.have.been.calledOnce;
					expect(env.res.status).to.have.been.calledWith(201);
				});
				it('should return the data', () => {
					expect(env.res.send).to.have.been.calledOnce;
					expect(env.res.send).to.have.been.calledWith(env.transactions[0]);
				});
			});
		});

		describe('put', () => {
			beforeEach(() => {
				env.handler = env.routes[3].handler;
			});

			describe('success', () => {
				beforeEach((done) => {
					env.req.params = {
						accountid: 'abc123',
						id: 'trans345'
					};
					env.req.body = env.transactions[0];
					env.fetch.returns(Promise.accept(env.response(200, 'OK', env.transactions[0])));
					env.handler(env.req,env.res,env.next)
					.then(() => {done();})
					.catch(done);
				});

				it('should call the service', () => {
					expect(env.fetch).to.have.been.calledOnce;
					expect(env.fetch).to.have.been.calledWith('http://host:port/users/user123/path/to/account/abc123/transactions/trans345', {
						method: 'PUT',
						headers: {
							'Accept': 'application/json',
							'Content-Type': 'application/json',
							'Authorization': 'Bearer ' + env.req.user.token
						},
						body: JSON.stringify(env.transactions[0])
					});
				});

				it('should return 200', () => {
					expect(env.res.status).to.have.been.calledOnce;
					expect(env.res.status).to.have.been.calledWith(200);
				});
				it('should return the data', () => {
					expect(env.res.send).to.have.been.calledOnce;
					expect(env.res.send).to.have.been.calledWith(env.transactions[0]);
				});
			});
		});

		describe('delete', () => {
			beforeEach(() => {
				env.handler = env.routes[4].handler;
			});

			describe('success', () => {
				beforeEach((done) => {
					env.req.params = {
						accountid: 'abc123',
						id: 'trans345'
					};
					env.fetch.returns(Promise.accept(env.response(200, 'OK', null)));
					env.handler(env.req,env.res,env.next)
					.then(() => {done();})
					.catch(done);
				});

				it('should call the service', () => {
					expect(env.fetch).to.have.been.calledOnce;
					expect(env.fetch).to.have.been.calledWith('http://host:port/users/user123/path/to/account/abc123/transactions/trans345', {
						method: 'DELETE',
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
			});
		});

		describe('search', () => {
			beforeEach(() => {
				env.handler = env.routes[5].handler;
			});

			describe('success', () => {
				beforeEach((done) => {
					env.req.params = {
						accountid: 'abc123',
						kind: 'fubar',
						search: 'stuff'
					};
					env.fetch.returns(Promise.accept(env.response(200, 'OK', env.transactions)));
                    env.handler(env.req,env.res,env.next)
                    .then(() => {done();})
                    .catch(done);
				});

				it('should call the service', () => {
					expect(env.fetch).to.have.been.calledOnce;
					expect(env.fetch).to.have.been.calledWith('http://host:port/users/user123/path/to/account/abc123/transactions/search/fubar/stuff', {
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
					expect(env.res.send).to.have.been.calledWith(env.transactions);
				});
			});
		});
	});
});
