module.exports = {
    path: '/users/meobject',
    method: 'GET',
    handler(request) {
        return {
            user: 'rick'
        };
    },
    options: {
        auth: 'jwt',
        description: 'Get current user details'
    }
};
