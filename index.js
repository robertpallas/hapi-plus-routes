'use strict';

const _ = require('lodash');
const glob = require('glob');
const Boom = require('boom');
const Joi = require('joi');
const chalk = require('chalk');
const STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
const ARGUMENT_NAMES = /([^\s,]+)/g;

function getParamNames(func) {
    let fnStr = func.toString().replace(STRIP_COMMENTS, '');
    let result = fnStr.slice(fnStr.indexOf('(')+1, fnStr.indexOf(')')).match(ARGUMENT_NAMES);
    if(result === null)
       result = [];
    return result;
}

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

            if(route.handler) {
                if(getParamNames(route.handler).length < 2) {
                    // default signature is (request, reply)
                    // if reply is omitted, then the return value should be interpreted
                    // as the reply.
                    // we wrap the handler function to support this
                    let orignalHandler = route.handler;
                    route.handler = (request, reply) => {
                        let retValue = orignalHandler.call(request);
                        if(retValue instanceof Promise) {
                          return retValue
                          .then(reply)
                          .catch(err => {
                              // handle promise rejection
                              if(err && err.isBoom) {
                                  // boom errors are put through
                                  return reply(err);
                              }
                              else {
                                  // other errors are logged and a generic error is sent instead
                                  server.log([request.method, request.path, 'error'], err);
                                  return reply(Boom.internal());
                              }
                          });
                        }
                        else {
                          reply(retValue);
                        }
                    }
                }
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
