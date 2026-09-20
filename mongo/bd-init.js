// Este script lo ejecuta automáticamente la imagen oficial de Mongo
// (docker-entrypoint-initdb.d) la PRIMERA vez que el contenedor arranca
// con el directorio de datos vacío. Si ya hay datos, Mongo lo ignora.
//
// Nota: corre en el shell de Mongo (mongosh), no es código Node/Mongoose.

db = db.getSiblingDB('tablero');

function isoDate(daysFromNow) {
  const d = new Date(Date.now() + daysFromNow * 86400000);
  return d.toISOString().slice(0, 10);
}

const boardIdArqWeb = ObjectId();
const boardIdMateDiscreta = ObjectId();

const listTodoId = ObjectId();
const listDoingId = ObjectId();
const listDoneId = ObjectId();

db.boards.insertOne({
  _id: boardIdMateDiscreta,
  name: 'Matematica Discreta',
  description: 'Tablero relacionado a la materia Matematica Discreta',
  createdAt: new Date("2026-09-20T14:30:00"),
});

db.boards.insertOne({
  _id: boardIdArqWeb,
  name: 'Arquitectura Web',
  description: 'Tablero relacionado a la materia Arquitectura Web',
  createdAt: new Date("2026-09-20T14:30:00"),
});

db.lists.insertMany([
  { _id: listTodoId, boardId: boardIdArqWeb, name: 'Por hacer', position: 1 },
  { _id: listDoingId, boardId: boardIdArqWeb, name: 'En progreso', position: 2 },
  { _id: listDoneId, boardId: boardIdArqWeb, name: 'Hecho', position: 3 },
]);

db.cards.insertMany([
  {
    listId: listTodoId,
    title: 'Diseñar modelo de datos',
    description: 'Definir entidades Board, List y Card',
    position: 1,
    dueDate: isoDate(5),
    labels: ['backend'],
    createdAt: new Date("2026-09-20T14:30:00"),
  },
  {
    listId: listTodoId,
    title: 'Armar documentación de la API',
    description: 'Documentar endpoints, verbos y status codes',
    position: 2,
    dueDate: isoDate(-2), // vencida, para ver el reporte funcionando
    labels: ['documentacion'],
    createdAt: new Date("2026-09-20T14:30:00"),
  },
  {
    listId: listDoingId,
    title: 'Implementar CRUD de tarjetas',
    description: 'Endpoints de alta, baja y modificación de cards',
    position: 1,
    dueDate: isoDate(3),
    labels: ['backend', 'prioridad-alta'],
    createdAt: new Date("2026-09-20T14:30:00"),
  },
  {
    listId: listDoneId,
    title: 'Configurar proyecto Express',
    description: 'Estructura inicial, dependencias y scripts de npm',
    position: 1,
    dueDate: isoDate(-1),
    labels: ['setup'],
    createdAt: new Date("2026-09-20T14:30:00"),
  },
]);

// Índices básicos para las consultas más frecuentes de la API
db.lists.createIndex({ boardId: 1 });
db.cards.createIndex({ listId: 1 });

print('✔ Seed inicial de Mongo cargado (1 board, 3 lists, 4 cards).');
