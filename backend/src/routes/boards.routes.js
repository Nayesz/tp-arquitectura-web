const { Router } = require('express');
const Board = require('../models/Board');
const List = require('../models/List');
const Card = require('../models/Card');
const { isValidObjectId } = require('../utils/isValidObjectId');

const router = Router();
/**
 * @swagger
 * /boards:
 *   get:
 *     summary: Lista todos los tableros
 *     tags: [Board]
 *     description: Devuelve el arreglo completo de tableros existentes. Si no hay ninguno, devuelve un arreglo vacío.
 *     responses:
 *       200:
 *         description: Lista de tableros obtenida correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Board'
 */
router.get('/', async (req, res, next) => {
  try {
    const boards = await Board.find().sort({ createdAt: 1 });
    res.status(200).json(boards);
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 * /boards:
 *   post:
 *     summary: Crea un nuevo tablero
 *     tags: [Board]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name:
 *                 type: string
 *                 example: TP DevOps
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Tablero creado correctamente
 *       400:
 *         description: Falta el campo "name" o el body es inválido
 */
router.post('/', async (req, res, next) => {
  try {
    const { name, description } = req.body || {};

    if (!name || typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({ error: 'El campo "name" es requerido y debe ser un texto no vacío.' });
    }

    const board = await Board.create({ name: name.trim(), description: description || '' });
    res.status(201).json(board);
  } catch (err) {
    next(err);
  }
});

// GET /api/boards/:id
router.get('/:id', async (req, res, next) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(404).json({ error: 'Tablero no encontrado.' });
    }

    const board = await Board.findById(req.params.id);

    if (!board) {
      return res.status(404).json({ error: 'Tablero no encontrado.' });
    }

    res.status(200).json(board);
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 * /boards/{id}:
 *   put:
 *     summary: Actualiza el nombre y/o la descripción de un tablero
 *     tags: [Board]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string, example: "Proyecto TP Integrador v2" }
 *               description: { type: string }
 *     responses:
 *       200:
 *         description: Tablero actualizado
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Board' }
 *       400:
 *         description: El body no cumple el formato esperado
 *       404:
 *         description: No existe ningún tablero con ese id
 */
router.put('/:id', async (req, res, next) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(404).json({ error: 'Tablero no encontrado.' });
    }

    const { name, description } = req.body || {};

    if (name !== undefined && (typeof name !== 'string' || !name.trim())) {
      return res.status(400).json({ error: 'El campo "name" debe ser un texto no vacío.' });
    }

    const update = {};
    if (name !== undefined) update.name = name.trim();
    if (description !== undefined) update.description = description;

    const board = await Board.findByIdAndUpdate(req.params.id, update, { new: true });

    if (!board) {
      return res.status(404).json({ error: 'Tablero no encontrado.' });
    }

    res.status(200).json(board);
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 * /boards/{id}:
 *   delete:
 *     summary: Elimina un tablero junto con sus listas y tarjetas
 *     tags: [Board]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       204:
 *         description: Tablero eliminado correctamente (sin contenido)
 *       404:
 *         description: No existe ningún tablero con ese id
 */
router.delete('/:id', async (req, res, next) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(404).json({ error: 'Tablero no encontrado.' });
    }

    const board = await Board.findByIdAndDelete(req.params.id);

    if (!board) {
      return res.status(404).json({ error: 'Tablero no encontrado.' });
    }

    // Elimina en cascada las listas del tablero y las tarjetas de esas listas
    const listIds = (await List.find({ boardId: board._id }, '_id')).map((l) => l._id);
    await Card.deleteMany({ listId: { $in: listIds } });
    await List.deleteMany({ boardId: board._id });

    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 * /boards/{boardId}/lists:
 *   get:
 *     summary: Lista las columnas de un tablero
 *     tags: [Board]
 *     parameters:
 *       - in: path
 *         name: boardId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Arreglo de listas del tablero (puede estar vacío)
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: { $ref: '#/components/schemas/List' }
 *       404:
 *         description: No existe ningún tablero con ese boardId
 */
router.get('/:boardId/lists', async (req, res, next) => {
  try {
    if (!isValidObjectId(req.params.boardId)) {
      return res.status(404).json({ error: 'Tablero no encontrado.' });
    }

    const board = await Board.findById(req.params.boardId);

    if (!board) {
      return res.status(404).json({ error: 'Tablero no encontrado.' });
    }

    const lists = await List.find({ boardId: board._id }).sort({ position: 1 });
    res.status(200).json(lists);
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 * /boards/{boardId}/lists:
 *   post:
 *     summary: Crea una nueva lista dentro de un tablero
 *     tags: [Board]
 *     parameters:
 *       - in: path
 *         name: boardId
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name: { type: string, example: "En progreso" }
 *               position: { type: number, example: 2 }
 *     responses:
 *       201:
 *         description: Lista creada correctamente
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/List' }
 *       400:
 *         description: Falta el campo "name" o el body es inválido
 *       404:
 *         description: No existe ningún tablero con ese boardId
 */
router.post('/:boardId/lists', async (req, res, next) => {
  try {
    if (!isValidObjectId(req.params.boardId)) {
      return res.status(404).json({ error: 'Tablero no encontrado.' });
    }

    const board = await Board.findById(req.params.boardId);

    if (!board) {
      return res.status(404).json({ error: 'Tablero no encontrado.' });
    }

    const { name, position } = req.body || {};

    if (!name || typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({ error: 'El campo "name" es requerido y debe ser un texto no vacío.' });
    }

    const existingCount = await List.countDocuments({ boardId: board._id });

    const list = await List.create({
      boardId: board._id,
      name: name.trim(),
      position: typeof position === 'number' ? position : existingCount + 1,
    });

    res.status(201).json(list);
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 * /boards/{boardId}/report:
 *   get:
 *     summary: Reporte de un tablero (tarjetas por lista, total y vencidas)
 *     tags: [Board]
 *     parameters:
 *       - in: path
 *         name: boardId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Reporte generado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 boardId: { type: string }
 *                 boardName: { type: string }
 *                 cardsPerList:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       listId: { type: string }
 *                       listName: { type: string }
 *                       count: { type: number }
 *                 totalCards: { type: number }
 *                 overdueCards: { type: number }
 *       404:
 *         description: No existe ningún tablero con ese boardId
 */
router.get('/:boardId/report', async (req, res, next) => {
  try {
    if (!isValidObjectId(req.params.boardId)) {
      return res.status(404).json({ error: 'Tablero no encontrado.' });
    }

    const board = await Board.findById(req.params.boardId);

    if (!board) {
      return res.status(404).json({ error: 'Tablero no encontrado.' });
    }

    const lists = await List.find({ boardId: board._id }).sort({ position: 1 });
    const today = new Date().toISOString().slice(0, 10);

    let totalCards = 0;
    let overdueCards = 0;

    const cardsPerList = await Promise.all(
      lists.map(async (list) => {
        const listCards = await Card.find({ listId: list._id });
        totalCards += listCards.length;
        overdueCards += listCards.filter((c) => c.dueDate && c.dueDate < today).length;

        return {
          listId: list._id.toString(),
          listName: list.name,
          count: listCards.length,
        };
      })
    );

    res.status(200).json({
      boardId: board._id.toString(),
      boardName: board.name,
      cardsPerList,
      totalCards,
      overdueCards,
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
