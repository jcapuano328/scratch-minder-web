'use strict';
var chai = require('chai'),
	expect = chai.expect,
	sinon = require('sinon'),
	sandbox = require('sandboxed-module'),
	_ = require('lodash');
chai.use(require('sinon-chai'));

describe('Server', () => {
	var env = {};
	beforeEach(() => {
		env = {};
        env.log = sandbox.require('../../mocks/log')();
        env.config = {
			port: 8888,
			paths: {
				routes: '/path/to/routes'
			},
			session: {
				secret: 'secret',
				cookie: {
					maxAge: 86400,
					secure: false,
					httpOnly: true
				}
			}
        };
		env.bodyParser = {
			urlencoded: sinon.stub().returns('urlencoded'),
			json: sinon.stub().returns('json')
		};
		env.cookieParser = sinon.stub().returns('cookieparser');
		env.jwt = sinon.stub().returns('jwt');
		env.httpserver = {
			close: sinon.stub()
		};
		env.app = {
			use: sinon.stub(),
	        listen: sinon.stub().returns(env.httpserver)
		};
		env.express = sinon.stub().returns(env.app);
		env.express.static = sinon.stub().returns('static');
        env.router = {
            register: sinon.stub()
        };

        env.server = sandbox.require('../../../src/server/server', {
			requires: {
                'config': env.config,
				'lodash': _,
				'body-parser': env.bodyParser,
				'cookie-parser': env.cookieParser,
				'express-jwt': env.jwt,
                'express': env.express,
                './lib/router': env.router,
                './lib/log': env.log
            }
		});
    });
    afterEach(() => {
        env.server.stop();
    });

    describe('start', () => {
        describe('success', () => {
            beforeEach((done) => {
                env.router.register.returns(Promise.resolve());
                env.app.listen.yields(null);
                env.server.start()
    			.then(() => { done(); })
    			.catch(done);
            });
            it('should create the application', () => {
                expect(env.express).to.have.been.calledOnce;
            });
			it('should use the json body parser', () => {
                expect(env.bodyParser.json).to.have.been.calledOnce;
                expect(env.app.use).to.have.been.calledWith('json');
            });
			it('should use the urlencoded body parser', () => {
                expect(env.bodyParser.urlencoded).to.have.been.calledOnce;
                expect(env.app.use).to.have.been.calledWith('urlencoded');
            });
            it('should use the cookie parser', () => {
                expect(env.cookieParser).to.have.been.calledOnce;
				expect(env.cookieParser).to.have.been.calledWith(env.config.session.secret, env.config.session.cookie);
                expect(env.app.use).to.have.been.calledWith('cookieparser');
            });
            it('should use the jwt parser', () => {
                expect(env.jwt).to.have.been.calledOnce;
				expect(env.jwt).to.have.been.calledWith({secret: env.config.session.secret, credentialsRequired: false});
                expect(env.app.use).to.have.been.calledWith('jwt');
            });
			it('should use the static service', () => {
                expect(env.express.static).to.have.been.calledOnce;
				expect(env.express.static).to.have.been.calledWith(sinon.match.string);
                expect(env.app.use).to.have.been.calledWith('/','static');
            });
            it('should register the routes', () => {
                expect(env.router.register).to.have.been.calledOnce;
            });
            it('should listen on the proper port', () => {
                expect(env.app.listen).to.have.been.calledOnce;
                expect(env.app.listen).to.have.been.calledWith(env.config.port);
            });
        });

        describe('invalid routes', () => {
            beforeEach((done) => {
                env.router.register.returns(Promise.reject('bad things, man'));
                env.server.start()
    			.then(() => { done('should have throw an exception'); })
    			.catch((err) => { expect(err).to.equal('bad things, man'); done();});
            });
			it('should create the application', () => {
                expect(env.express).to.have.been.calledOnce;
            });
			it('should use the json body parser', () => {
                expect(env.bodyParser.json).to.have.been.calledOnce;
                expect(env.app.use).to.have.been.calledWith('json');
            });
			it('should use the urlencoded body parser', () => {
                expect(env.bodyParser.urlencoded).to.have.been.calledOnce;
                expect(env.app.use).to.have.been.calledWith('urlencoded');
            });
            it('should use the cookie parser', () => {
                expect(env.cookieParser).to.have.been.calledOnce;
				expect(env.cookieParser).to.have.been.calledWith(env.config.session.secret, env.config.session.cookie);
                expect(env.app.use).to.have.been.calledWith('cookieparser');
            });
            it('should use the jwt parser', () => {
                expect(env.jwt).to.have.been.calledOnce;
				expect(env.jwt).to.have.been.calledWith({secret: env.config.session.secret, credentialsRequired: false});
                expect(env.app.use).to.have.been.calledWith('jwt');
            });
			it('should use the static service', () => {
                expect(env.express.static).to.have.been.calledOnce;
				expect(env.express.static).to.have.been.calledWith(sinon.match.string);
                expect(env.app.use).to.have.been.calledWith('/','static');
            });
            it('should register the routes', () => {
                expect(env.router.register).to.have.been.calledOnce;
            });
            it('should not listen on the proper port', () => {
                expect(env.app.listen).to.not.have.been.called;
            });
        });

        describe('port conflict', () => {
            beforeEach((done) => {
                env.router.register.returns(Promise.resolve());
                env.app.listen.throws('port conflict');
                env.server.start()
    			.then(() => { done('should have throw an exception'); })
    			.catch((err) => { expect(err.name).to.equal('port conflict'); done();});
            });
			it('should create the application', () => {
                expect(env.express).to.have.been.calledOnce;
            });
			it('should use the json body parser', () => {
                expect(env.bodyParser.json).to.have.been.calledOnce;
                expect(env.app.use).to.have.been.calledWith('json');
            });
			it('should use the urlencoded body parser', () => {
                expect(env.bodyParser.urlencoded).to.have.been.calledOnce;
                expect(env.app.use).to.have.been.calledWith('urlencoded');
            });
            it('should use the cookie parser', () => {
                expect(env.cookieParser).to.have.been.calledOnce;
				expect(env.cookieParser).to.have.been.calledWith(env.config.session.secret, env.config.session.cookie);
                expect(env.app.use).to.have.been.calledWith('cookieparser');
            });
            it('should use the jwt parser', () => {
                expect(env.jwt).to.have.been.calledOnce;
				expect(env.jwt).to.have.been.calledWith({secret: env.config.session.secret, credentialsRequired: false});
                expect(env.app.use).to.have.been.calledWith('jwt');
            });
			it('should use the static service', () => {
                expect(env.express.static).to.have.been.calledOnce;
				expect(env.express.static).to.have.been.calledWith(sinon.match.string);
                expect(env.app.use).to.have.been.calledWith('/','static');
            });
            it('should register the routes', () => {
                expect(env.router.register).to.have.been.calledOnce;
            });
            it('should listen on the proper port', () => {
				expect(env.app.listen).to.have.been.calledOnce;
                expect(env.app.listen).to.have.been.calledWith(env.config.port);
            });
        });
        //it('should accept connections');
    });

    describe('stop', () => {
        beforeEach(() => {
            env.router.register.returns(Promise.resolve());
            env.app.listen.yields(null);
            env.httpserver.close.yields(null);
            return env.server.start()
            .then(() => {
                return env.server.stop();
            });
        });
        it('should stop listening', () => {
            expect(env.httpserver.close).to.have.been.calledOnce;
        });
    });
});
