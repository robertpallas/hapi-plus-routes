module.exports = {
    path: '/users/promiseme',
    method: 'GET',
    handler(request) {
        return Promise.resolve({
          user: 'rick'
        })
    },
    config: {
        auth: 'jwt',
        description: 'Get current user details'
    }
};
