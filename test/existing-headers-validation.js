const Routes = require('../');
const should = require('should');
const MockServer = require('./mockServer.js');

describe('headers validation', () => {
    const mockServer = new MockServer();

    it('should not overwrite existing headers validation', () => {
        Routes.register(mockServer, { routes: './test/routes/headers/headersValidationRoute.js' }, () => {});

        const registeredRoute = mockServer.routes['/headersvalidation'];
        const routeConfig = registeredRoute.config;

        routeConfig.should.be.an.instanceOf(Object).and.have.property('validate');
        routeConfig.validate.should.be.an.instanceOf(Object).and.have.property('headers');
        routeConfig.validate.headers.should.be.an.instanceOf(Object)
          .and.not.have.property('isJoi')
          .and.have.property('x-custom-test-header');
    });
});
