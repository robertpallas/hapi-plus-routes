const _ = require('lodash');
const glob = require('glob');
const Boom = require('boom');
const Joi = require('joi');
const chalk = require('chalk');
const pkg = require('./package.json');

function resolveRouteImport(path) {
  /* eslint global-require: 0, import/no-dynamic-require: 0, no-underscore-dangle: 0  */
  const route = require(path);
  return route.__esModule && Object.keys(route).indexOf('default') >= 0 ? route.default : route;
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
          if (route.path.charAt(0) !== '/') {
            route.path = `/${route.path}`;
          }
          route.path = options.prefix + route.path;
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
