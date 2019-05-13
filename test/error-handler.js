const Routes = require('..');
const should = require('should');
const MockServer = require('./mockServer');
const MockRequest = require('./mockRequest');


describe('null error handler', () => {
  const mockServer = new MockServer();

  Routes.register(mockServer, {
    routes: './test/routes/errors/*.js',
  }, () => {});

  const route = mockServer.routes['/errors/thrown'];
  it('should pass error upward', async () => {
    let caughtError = null;
    try {
      await route.handler(new MockRequest());
    } catch(err) {
      caughtError = err;
    }
    should.exist(caughtError);
  });
});

describe('custom error handler', () => {
  
  it('should run custom error handler', async () => {
    const mockServer = new MockServer();
    const mockRequest = new MockRequest('errorHandler1');

    let errorHandlerCalled = false;

    Routes.register(mockServer, {
      routes: './test/routes/errors/*.js',
      errorHandler: (request, error) => {
        error.message.should.equal('My error message');
        request.id.should.equal('errorHandler1');
        errorHandlerCalled = true;
      },
    }, () => {});
    const route = mockServer.routes['/errors/thrown'];
    await route.handler(mockRequest);
    
    should(errorHandlerCalled).equal(true);
    
  });

  it('should not break with try-catch inside handler', async () => {
    const mockServer = new MockServer();
    const mockRequest = new MockRequest('errorHandler2');

    let errorHandlerCalled = false;

    Routes.register(mockServer, {
      routes: './test/routes/errors/*.js',
      errorHandler: (request, error) => {
        errorHandlerCalled = true;
      },
    }, () => {});
    const route = mockServer.routes['/errors/caught'];
    await route.handler(mockRequest);
    
    should(errorHandlerCalled).equal(false);
    
  });
});

