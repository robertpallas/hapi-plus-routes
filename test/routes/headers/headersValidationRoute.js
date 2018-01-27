const Joi = require('joi');

module.exports = {
    path: '/headersvalidation',
    method: 'GET',
    handler: () => {},
    config: {
        auth: 'custom-auth',
        validate: {
            headers: {
                'x-custom-test-header': Joi.string().required()
            }
        }
    }
};
