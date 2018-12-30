module.exports = class MockRequest {
  constructor(id) {
    this.id = id;
  }

  log(tags, message) {
      // console.log(tags, message);
  }
};
