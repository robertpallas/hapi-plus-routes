module.exports = {
    path: '/users/promisemerejection',
    method: 'GET',
    handler: request => Promise.reject(new Error('My exception')),
    config: {
        auth: 'jwt',
        description: 'Get current user details'
    }
};
