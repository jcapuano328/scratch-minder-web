'use strict';
var chai = require('chai'),
	expect = chai.expect,
	sinon = require('sinon'),
	sandbox = require('sandboxed-module'),
	path = require('path');
chai.use(require('sinon-chai'));

describe('Index Route', () => {
	var env = {};
	beforeEach(() => {
		env = {};
        env.log = sandbox.require('../../mocks/log')();
		env.root = path.resolve(__dirname, '../../../src/server/routes');
		env.indexfile = '/path/to/views/index.html';
		env.path = {
			join: sinon.stub().returns(env.indexfile)
		};
        env.req = {
        };
        env.res = {
            sendFile: sinon.stub()
        };
        env.next = sinon.stub();

        env.routes = sandbox.require('../../../src/server/routes/index', {
            requires: {
                'path': env.path,
                '../lib/log': env.log
            }
        });
    });

    describe('interface', () => {
        it('should have a single route', () => {
            expect(env.routes).to.be.an.array;
            expect(env.routes).to.have.length(1);
        });
        it('should have a method', () => {
            expect(env.routes[0]).to.have.property('method', 'get');
        });
        it('should have a uri', () => {
            expect(env.routes[0]).to.have.property('uri', '/');
        });
        it('should not be protected', () => {
            expect(env.routes[0]).to.have.property('protected', false);
        });
        it('should have a handler', () => {
            expect(env.routes[0]).to.respondTo('handler');
        });
    });

    describe('handler', () => {
        beforeEach(() => {
            env.handler = env.routes[0].handler;
        });
        describe('success', () => {
            beforeEach((done) => {
                env.res.sendFile.yields(null);
                env.handler(env.req,env.res,env.next).then(done).catch(done);
            });
            it('should construct the path to the index html', () => {
                expect(env.path.join).to.have.been.calledOnce;
                expect(env.path.join).to.have.been.calledWith(env.root, '..', 'content', 'views', 'index.html');
            });
            it('should return file to the caller', () => {
                expect(env.res.sendFile).to.have.been.calledOnce;
                expect(env.res.sendFile).to.have.been.calledWith(env.indexfile);
            });
        });
        describe('failure', () => {
			beforeEach((done) => {
				env.res.sendFile.yields('bad things, man');
                env.handler(env.req,env.res,env.next)
                .then(() => {done('should not succeed');})
                .catch((err) => {
					expect(err).to.equal('bad things, man');
					done();
				});
            });
			it('should construct the path to the index html', () => {
                expect(env.path.join).to.have.been.calledOnce;
                expect(env.path.join).to.have.been.calledWith(env.root, '..', 'content', 'views', 'index.html');
            });
            it('should return file to the caller', () => {
                expect(env.res.sendFile).to.have.been.calledOnce;
                expect(env.res.sendFile).to.have.been.calledWith(env.indexfile);
            });
        });
    });
});
