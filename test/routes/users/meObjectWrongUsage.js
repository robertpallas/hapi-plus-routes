module.exports = {
    path: '/users/meobjectwrongusage',
    method: 'GET',
    handler(request, reply) {
        reply({
            user: 'rick'
        });
        return {
            user: 'morty'
        };
    },
    config: {
        auth: 'jwt',
        description: 'Get current user details'
    }
};
