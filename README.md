hapi-plus-routes
================

Hapi plugin. Automatically add routes applying defaults from directory to Hapi API. 
Works with Hapi 17+.

Installation
------------

    yarn add hapi-plus-routes
    
or    

    npm i -S hapi-plus-routes

Example
-------
Where registering Hapi plugins add:

```js
const Routes = require('hapi-plus-routes');
const routeOptions = {
  routes: './routes/**/*.js',
  defaultRoute: {
    path: '/users',
    options: {
      plugins: {
        policies: ['preResponsePolicy'],
      },
    },
  },
};

server.register({
  plugin: Routes,
  options: routeOptions,
});
```

For complete example check [Hapi starter](https://github.com/Devtailor/hapi-starter).

Error handling
----------------------
You may specify a custom error handler which will catch exceptions thrown in your routes and do something with them. A 500 internal server error will be returned.

```
const Routes = require('hapi-plus-routes');
const routeOptions = {
  routes: './routes/**/*.js',
  errorHandler: (request, error) => {
    // Do something with the error
    request.log([request.method, request.path, 'error'], error);
  },
};

server.register({
  plugin: Routes,
  options: routeOptions,
});
```

Path prefix
----------------------
You may specify a path prefix for all routes by supplying the `prefix` option.

```
const routeOptions = {
  routes: './routes/**/*.js',
  prefix: '/some-prefix',
};
```
