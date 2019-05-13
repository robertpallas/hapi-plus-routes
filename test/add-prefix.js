const Routes = require('..');
const should = require('should');
const MockServer = require('./mockServer');
const MockRequest = require('./mockRequest');


describe('add prefix', () => {
  const mockServer = new MockServer();

  Routes.register(mockServer, {
    routes: './test/routes/simple/*.js',
    prefix: '/test-prefix'
  }, () => { });

  
  it('should successfully add prefix', async () => {
    const route = mockServer.routes['/test-prefix/simple'];
    should.exist(route);
  });
});



