const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'Api Rest para tablero',
    description: 'Documentación generada automáticamente con swagger-autogen',
    version: '1.0.0'
  },
  host: 'localhost:3000',
  basePath: '/api' 
};

const outputFile = './swagger-output.json';
const routesEndpointsFiles = ['./server.js']; 

// archivo JSON que genera
swaggerAutogen(outputFile, routesEndpointsFiles, doc);