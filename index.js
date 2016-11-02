'use strict';

const _ = require('lodash');
const glob = require('glob');
const Boom = require('boom');
const Joi = require('joi');
const chalk = require('chalk');

let defaultRoute = {
    method: 'GET',
    handler: (request, reply) => {
        reply(Boom.notImplemented());
    },
    config: {
        auth: false,
        plugins: {
            policies: []
        },
        tags: ['api']
    }
};

exports.register = (server, options, next) => {
    let globOptions = {
        nodir: true,
        strict: true,
        cwd: options.cwd || process.cwd()
    };

    let files = glob.sync(options.routes, globOptions);
    files.forEach(file => {
        let route = null;

        try {
            route = require(globOptions.cwd + '/' + file);
            route = _.defaultsDeep(route, defaultRoute);

            if(route.config.auth) {
                if(!route.config) {
                    route.config = {};
                }
                if(!route.config.validate) {
                    route.config.validate = {};
                }
                
                route.config.validate.headers = Joi.object({
                        Authorization: Joi.string().description('JWT token')
                    }).unknown();
            }

            server.route(route);
            server.log(['startup', 'route-load'], chalk.green(route.method) + ' ' + route.path);
        } catch (err) {
            if (route) {
                err = chalk.red(route.method) + ' ' + route.path + ' ' + err;
            } else {
                err = chalk.red(err);
            }
            server.log(['startup', 'route-load', 'error'], err);
        }
    });

    next();
};

exports.register.attributes = {
    multiple: false,
    pkg: require('./package.json')
};