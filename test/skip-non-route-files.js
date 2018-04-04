const Routes = require('../');
const should = require('should');
const MockServer = require('./mockServer.js');

describe('do not load files that are not routes', () => {
    const mockServer = new MockServer();

    it('should not load test files or routes without path', () => {
        Routes.register(mockServer, {
            routes: './test/routes/not-to-be-loaded/*'
        }, () => {});

        Object.keys(mockServer.routes).should.be.empty();
    });
});
