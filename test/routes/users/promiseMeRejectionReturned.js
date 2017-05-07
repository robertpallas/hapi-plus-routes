const Boom = require('boom');
module.exports = {
    path: '/users/promisemerejectionreturned',
    method: 'GET',
    handler(request) {
        return Promise.resolve()
        .then(() => {
            throw new Error('My exception');
        })
        .catch((err) => {
            throw Boom.badRequest('A Boom Error');
        });
    },
    config: {
        auth: 'jwt',
        description: 'Get current user details'
    }
};
