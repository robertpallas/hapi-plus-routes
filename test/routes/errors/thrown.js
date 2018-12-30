module.exports = {
  path: '/errors/thrown',
  method: 'GET',
  handler(request) {
    throw new Error('My error message');
  },
};
