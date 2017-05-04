module.exports = {
    path: '/users/meobjectwrongusage',
    method: 'GET',
    handler(request, reply) {
      return {
        user: 'morty'
      };
    },
    config: {
        auth: 'jwt',
        description: 'Get current user details'
    }
};
