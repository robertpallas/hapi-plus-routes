module.exports = {
  path: '/errors/caught',
  method: 'GET',
  handler(request) {
    try {
      throw new Error('My error message');
    } catch (err) {
      return "error caught";
    }
    
  },
};
