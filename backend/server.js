const express = require('express');
const cors = require('cors');
/** Swagger */
const swaggerSpec = require('./src/config/swagger');
const swaggerUi = require('swagger-ui-express');
/** bbdd */
const { connectDB } = require('./src/db/connection');
const { seedIfEmpty } = require('./src/data/seed');
/** routes */
const boardsRoutes = require('./src/routes/boards.routes');
const listsRoutes = require('./src/routes/lists.routes');
const cardsRoutes = require('./src/routes/cards.routes');

const { notFoundHandler, errorHandler } = require('./src/middlewares/errorHandlers');

const app = express();
const PORT = process.env.PORT || 3000;


app.use(cors());
app.use(express.json());
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get('/', (req, res) => {
  res.status(200).json({ message: 'API de Tablero. Ver documentación en /api/boards' });
});
app.use('/api/boards', boardsRoutes);
app.use('/api/lists', listsRoutes);
app.use('/api/cards', cardsRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

async function start() {
  await connectDB();
  //await seedIfEmpty();

  app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
    console.log(`Documentación: http://localhost:${PORT}/docs`);

  });
}

start().catch((err) => {
  console.error('No se pudo iniciar el servidor:', err.message);
  process.exit(1);
});
