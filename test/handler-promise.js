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

describe('promise based handler', () => {
  let mockServer = new MockServer();
  it('should handle returned promise', () => {
    Routes.register(mockServer, { routes: './test/routes/**/*.js' }, () => {});
    return Promise.all(
      mockServer.routes.map((route) => {
        // all handlers should be handled correctly
        switch(route.path) {
          case '/users/me': // the legacy way of using handlers
          case '/users/promiseme': // returns a promise
          case '/users/meobject': { // returns just an object
            let replyData;
            let handlerReturnValue = route.handler({}, (data) => {
              replyData = data;
              return data;
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
      replyData.length.should.be.equal(3);
      replyData.map(data => {
        data.should.be.eql({user: 'rick'});
      })
    });
  });
});
