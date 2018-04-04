const Routes = require('../');
const should = require('should');
const MockServer = require('./mockServer.js');

describe('different handler types', () => {
    const mockServer = new MockServer();
    it('should handle all handler types', () => {
        Routes.register(mockServer, { routes: './test/routes/users/*.js' }, () => {});
        return Promise.all(
            Object.keys(mockServer.routes).map((routeKey) => {
                const route  = mockServer.routes[routeKey];
                // all handlers should be handled correctly
                switch (route.path) {
                case '/users/me': // the legacy way of using handlers
                case '/users/promiseme': // returns a promise
                case '/users/meobject':
                case '/users/meobjectwrongusage':
                case '/users/promisemerejectionreturned':
                case '/users/promisemerejection': { // returns just an object
                    const replyData = { path: route.path };
                    const handlerReturnValue = route.handler({}, (data) => {
                        replyData.data = data;
                        return replyData;
                    });
                    if(handlerReturnValue instanceof Promise) {
                        return handlerReturnValue;
                    }

                    return replyData;
                }
                default: {
                        // console.log('ignore', route.path);
                        // ignore
                }
                }
            })
        )
        .then((replyData) => {
            // console.log(replyData);
            replyData.length.should.be.equal(5);
            replyData.map((obj) => {
                switch (obj.path) {
                case '/users/promisemerejection': {
                    should(obj.data instanceof Error).be.equal(true);
                    obj.data.output.payload.statusCode.should.be.equal(500);
                    obj.data.output.payload.message.should.be.equal('An internal server error occurred');
                    break;
                }
                case '/users/promisemerejectionreturned': {
                    obj.data.output.payload.message.should.be.equal('A Boom Error');
                    break;
                }
                default: {
                    obj.data.should.be.eql({ user: 'rick' });
                }
                }
            });
        });
    });
});
