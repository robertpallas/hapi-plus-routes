module.exports = {
    path: '/users/me',
    method: 'GET',
    handler(request, reply) {
        reply({
          user: 'rick'
        });
    },
    config: {
        auth: 'jwt',
        description: 'Get current user details'
    }
};
