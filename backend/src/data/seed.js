const Board = require('../models/Board');
const List = require('../models/List');
const Card = require('../models/Card');

function isoDate(daysFromNow) {
  const d = new Date(Date.now() + daysFromNow * 86400000);
  return d.toISOString().slice(0, 10);
}

async function seedIfEmpty() {
  const boardCount = await Board.countDocuments();

  if (boardCount > 0) {
    console.log('Ya hay datos en la base, se omite el seed.');
    return;
  }

  console.log('Base de datos vacía: cargando seed...');

  const board = await Board.create({
    name: 'Proyecto TP Integrador',
    description: 'Tablero de ejemplo cargado automáticamente al iniciar el servidor',
  });

  const [listTodo, listDoing, listDone] = await List.create([
    { boardId: board._id, name: 'Por hacer', position: 1 },
    { boardId: board._id, name: 'En progreso', position: 2 },
    { boardId: board._id, name: 'Hecho', position: 3 },
  ]);

  await Card.create([
    {
      listId: listTodo._id,
      title: 'Diseñar modelo de datos',
      description: 'Definir entidades Board, List y Card',
      position: 1,
      dueDate: isoDate(5),
      labels: ['backend'],
    },
    {
      listId: listTodo._id,
      title: 'Armar documentación de la API',
      description: 'Documentar endpoints, verbos y status codes',
      position: 2,
      dueDate: isoDate(-2), // vencida, para probar el reporte
      labels: ['documentacion'],
    },
    {
      listId: listDoing._id,
      title: 'Implementar CRUD de tarjetas',
      description: 'Endpoints de alta, baja y modificación de cards',
      position: 1,
      dueDate: isoDate(3),
      labels: ['backend', 'prioridad-alta'],
    },
    {
      listId: listDone._id,
      title: 'Configurar proyecto Express',
      description: 'Estructura inicial, dependencias y scripts de npm',
      position: 1,
      dueDate: isoDate(-1),
      labels: ['setup'],
    },
  ]);

  console.log('Seed cargado correctamente.');
}

module.exports = { seedIfEmpty };
