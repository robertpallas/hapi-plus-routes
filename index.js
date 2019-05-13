const _ = require('lodash');
const glob = require('glob');
const Boom = require('boom');
const Joi = require('joi');
const chalk = require('chalk');
const pkg = require('./package.json');
const path = require('path');

function resolveRouteImport(routePath) {
  /* eslint global-require: 0, import/no-dynamic-require: 0, no-underscore-dangle: 0  */
  const route = require(routePath);
  return route.__esModule && Object.keys(route).indexOf('default') >= 0 ? route.default : route;
}

function validateOptions(options) {
  if (options && options.prefix) {
    if (options.prefix.charAt(0) !== '/' || options.prefix.substr(-1) === '/') {
      throw new Error('The route prefix must start with a slash and must not end with a slash');
    }
  }
}

const defaultRoute = {
  method: 'GET',
  handler: (request, reply) => {
    reply(Boom.notImplemented());
  },
  options: {
    auth: false,
    plugins: {
      policies: [],
    },
    tags: ['api'],
  },
};


module.exports = {
  pkg,
  async register(server, options) {
    validateOptions(options);

    const globOptions = {
      nodir: true,
      strict: true,
      cwd: options.cwd || process.cwd(),
    };

    const files = glob.sync(options.routes, globOptions);
    files.forEach((file) => {
      let route = null;

      try {
        route = resolveRouteImport(`${globOptions.cwd}/${file}`);
        route = _.defaultsDeep(route, options.defaultRoute, defaultRoute);

        if (options.prefix) {
          route.path = path.posix.join(options.prefix, route.path);
        }

        if (route.options.auth && !(route.options.validate && route.options.validate.headers)) {
          route.options.validate = route.options.validate || {};
          route.options.validate.headers = Joi.object({
            Authorization: Joi.string().description('Auth token'),
          }).unknown();
        }

        if (route.handler && route.path && route.method) {
          const originalHandler = route.handler;

          /* eslint consistent-return: 0 */
          route.handler = async (request, h) => {
            try {
              return await originalHandler.call(null, request, h);
            } catch (error) {
              if (options.errorHandler) {
                await options.errorHandler(request, error);
              } else {
                throw error;
              }
            }
          };
          server.route(route);
          server.log(['startup', 'route-load'], `${chalk.green(route.method)} ${route.path}`);
        }
      } catch (err) {
        let logErr;
        if (route) {
          logErr = `${chalk.red(route.method)} ${route.path} ${err}`;
        } else {
          logErr = chalk.red(err);
        }
        server.log(['startup', 'route-load', 'error'], logErr);
      }
    });
  },
};
