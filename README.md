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
const routeOptions = {{
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
You may specify a custom error handler which will catch exceptions thrown in your routes and do something with it.

```
const Routes = require('hapi-plus-routes');
const routeOptions = {{
  routes: './routes/**/*.js',
  errorHandler: (error) => {
    // Do something with the error
  },
};

server.register({
  plugin: Routes,
  options: routeOptions,
});
```