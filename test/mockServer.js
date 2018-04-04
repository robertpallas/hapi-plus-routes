module.exports = class MockServer {
  constructor() {
    this.routes = {};
  }

  log(tags, message) {}

  route(routeObj) {
    this.routes[routeObj.path] = routeObj
  }
};