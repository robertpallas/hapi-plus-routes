const Routes = require('../');
const should = require('should');

class MockServer {
    constructor() {
        this.routes = [];
    }

    log (tags, message) {
        console.log(message);
    }

    route (routeObj) {
        this.routes.push(routeObj);
    }
}

describe('different handler types', () => {
    let mockServer = new MockServer();
    it('should handle all handler types', () => {
        Routes.register(mockServer, { routes: './test/routes/**/*.js' }, () => {});
        return Promise.all(
            mockServer.routes.map((route) => {
                // all handlers should be handled correctly
                switch(route.path) {
                    case '/users/me': // the legacy way of using handlers
                    case '/users/promiseme': // returns a promise
                    case '/users/meobject':
                    case '/users/meobjectwrongusage':
                    case '/users/promisemerejection': { // returns just an object
                        let replyData = { path:route.path };
                        let handlerReturnValue = route.handler({}, (data) => {
                            replyData.data = data;
                            return replyData;
                        });
                        if(handlerReturnValue instanceof Promise) {
                            return handlerReturnValue;
                        }
                        else {
                            return replyData;
                        }
                    }
                    default: {
                        console.log('ignore', route.path);
                        // ignore
                    }
                }
            })
        )
        .then(replyData => {
            console.log(replyData);
            replyData.length.should.be.equal(4);
            replyData.map((obj) => {
                switch(obj.path) {
                    case '/users/promisemerejection': {
                        should(obj.data instanceof Error).be.equal(true);
                        obj.data.statusCode.should.be.equal(500);
                        obj.data.message.should.be.equal('Internal error');
                        break;
                    }
                    default: {
                        obj.data.should.be.eql({user: 'rick'});
                    }
                };
            })
        });
    });
});
