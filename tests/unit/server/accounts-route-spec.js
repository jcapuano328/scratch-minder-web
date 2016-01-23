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
				transactions: '/path/to/login'
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

        env.routes = sandbox.require('../../../src/server/routes/accounts', {
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
        describe('get transactions for an account', () => {
            beforeEach(() => {
                env.route = env.routes[2];
            });
            it('should have a method', () => {
                expect(env.route).to.have.property('method', 'get');
            });
            it('should have a uri', () => {
                expect(env.route).to.have.property('uri', '/accounts/:id/transactions');
            });
            it('should be protected', () => {
                expect(env.route).to.have.property('protected', true);
            });
            it('should have a handler', () => {
                expect(env.route).to.respondTo('handler');
            });
        });
        describe('get a transaction', () => {
            beforeEach(() => {
                env.route = env.routes[3];
            });
            it('should have a method', () => {
                expect(env.route).to.have.property('method', 'get');
            });
            it('should have a uri', () => {
                expect(env.route).to.have.property('uri', '/accounts/:id/transactions/:transid');
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
                env.route = env.routes[4];
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
                env.route = env.routes[5];
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
                env.route = env.routes[6];
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
		describe('transactions', () => {
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
			describe('get', () => {
				beforeEach(() => {
					env.handler = env.routes[2].handler;
				});

				describe('success', () => {
					beforeEach((done) => {
						env.fetch.onFirstCall().returns(Promise.accept(env.response(200, 'OK', env.transactions)));
						env.jwt.sign.yields(env.token);
	                    env.handler(env.req,env.res,env.next)
	                    .then(() => {done();})
	                    .catch(done);

					});
				});

			});

		});

	});
});
