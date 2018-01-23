const { join, dirname } = require('path');
const Hapi = require('hapi');
const inert = require('inert');

(async () => {

  const server = new Hapi.Server({
    host: '0.0.0.0',
    port: 9000
  });

  await server.register(inert);

  server.route({
    method: 'GET',
    path: '/{param*}',
    handler: {
      directory: {
        path: join(dirname(__dirname), 'dist')
      }
    }
  });

  await server.start()

  return server;

})()

  .then((server) => {
    console.log(`🦄  App listening on ${server.info.host}:${server.info.port}…`);
  })
  .catch((err) => {
    console.log(err);
  });


