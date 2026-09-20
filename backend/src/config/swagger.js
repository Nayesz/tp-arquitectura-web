const swaggerJsdoc = require('swagger-jsdoc');

// Configuración del objeto de opciones
const options = {
  definition: {
    openapi: '3.0.0', // Versión de OpenAPI utilizada
    info: {
      title: 'API Rest Tablero', // Título de la documentación
      version: '1.0.0', // Versión de tu API
      description: 'Documentación de los endpoints para el Tablero',// Descripción
    },
    components: {
      schemas: {
        Board: {
          type: 'object',
          properties: {
            id: { type: 'string', example: '66f1a2b3c4d5e6f7a8b9c0d1' },
            name: { type: 'string', example: 'Proyecto TP Integrador' },
            description: { type: 'string', example: 'Tablero de ejemplo' },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        List: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            boardId: { type: 'string' },
            name: { type: 'string', example: 'Por hacer' },
            position: { type: 'number', example: 1 },
          },
        },
        Card: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            listId: { type: 'string' },
            title: { type: 'string', example: 'Diseñar modelo de datos' },
            description: { type: 'string' },
            position: { type: 'number' },
            dueDate: { type: 'string', format: 'date', nullable: true },
            labels: { type: 'array', items: { type: 'string' } },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
      },
    },
    servers: [
      {
        url: 'http://localhost:3000/api', // URL base de tu servidor de desarrollo
        description: 'Servidor de Desarrollo',
      },
    ],
  },
  // Rutas a los archivos que contienen las anotaciones YAML de Swagger (JSDoc)
  apis: ['./src/routes/*.js', './src/models/*.js'], 
};

// Inicializar swagger-jsdoc
const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;