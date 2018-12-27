const Routes = require('../');
const should = require('should');
const MockServer = require('./mockServer.js');

describe('routes defaults', () => {
    const mockServer = new MockServer();
    const defaultRoute = {
        options: {
            plugins: {
                policies: ['policy1', 'policy2']
            }
        }
    };

    Routes.register(mockServer, {
        routes: './test/routes/users/*.js',
        defaultRoute
    }, () => {});

    const registeredRoute = mockServer.routes['/users/meobject'];
    const routeConfig = registeredRoute.options;

    it('should respect default route fields from options', () => {
        routeConfig.should.be.an.instanceOf(Object).and.have.property('plugins');
        routeConfig.plugins.should.be.an.instanceOf(Object).and.have.property('policies');
        routeConfig.plugins.policies.should.be.an.instanceOf(Array);
        routeConfig.plugins.policies.length.should.equal(defaultRoute.options.plugins.policies.length);
    });

    it('should respect default route fields from plugin', () => {
        routeConfig.should.have.property('tags');
        routeConfig.tags.should.be.an.instanceOf(Array);
        routeConfig.tags[0].should.equal('api');
    });
});
