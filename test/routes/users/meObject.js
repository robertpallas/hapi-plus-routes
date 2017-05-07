module.exports = {
    path: '/users/meobject',
    method: 'GET',
    handler(request) {
        return {
            user: 'rick'
        };
    },
    config: {
        auth: 'jwt',
        description: 'Get current user details'
    }
};
