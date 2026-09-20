const { Router } = require('express');
const List = require('../models/List');
const Card = require('../models/Card');
const { isValidObjectId } = require('../utils/isValidObjectId');

const router = Router();

/**
 * @swagger
 * /lists/{id}:
 *   put:
 *     summary: Actualiza el nombre y/o la posición de una lista
 *     tags: [Lists]
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
 *               name: { type: string, example: "En revisión" }
 *               position: { type: number, example: 3 }
 *     responses:
 *       200:
 *         description: Lista actualizada
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/List' }
 *       400:
 *         description: El body no cumple el formato esperado
 *       404:
 *         description: No existe ninguna lista con ese id
 */
router.put('/:id', async (req, res, next) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(404).json({ error: 'Lista no encontrada.' });
    }

    const { name, position } = req.body || {};

    if (name !== undefined && (typeof name !== 'string' || !name.trim())) {
      return res.status(400).json({ error: 'El campo "name" debe ser un texto no vacío.' });
    }

    if (position !== undefined && typeof position !== 'number') {
      return res.status(400).json({ error: 'El campo "position" debe ser numérico.' });
    }

    const update = {};
    if (name !== undefined) update.name = name.trim();
    if (position !== undefined) update.position = position;

    const list = await List.findByIdAndUpdate(req.params.id, update, { new: true });

    if (!list) {
      return res.status(404).json({ error: 'Lista no encontrada.' });
    }

    res.status(200).json(list);
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 * /lists/{id}:
 *   delete:
 *     summary: Elimina una lista junto con sus tarjetas
 *     tags: [Lists]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       204:
 *         description: Lista eliminada correctamente
 *       404:
 *         description: No existe ninguna lista con ese id
 */
router.delete('/:id', async (req, res, next) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(404).json({ error: 'Lista no encontrada.' });
    }

    const list = await List.findByIdAndDelete(req.params.id);

    if (!list) {
      return res.status(404).json({ error: 'Lista no encontrada.' });
    }

    await Card.deleteMany({ listId: list._id });

    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 * /lists/{listId}/cards:
 *   get:
 *     summary: Lista las tarjetas de una columna
 *     tags: [Lists]
 *     parameters:
 *       - in: path
 *         name: listId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Arreglo de tarjetas de la lista (puede estar vacío)
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: { $ref: '#/components/schemas/Card' }
 *       404:
 *         description: No existe ninguna lista con ese listId
 */
router.get('/:listId/cards', async (req, res, next) => {
  try {
    if (!isValidObjectId(req.params.listId)) {
      return res.status(404).json({ error: 'Lista no encontrada.' });
    }

    const list = await List.findById(req.params.listId);

    if (!list) {
      return res.status(404).json({ error: 'Lista no encontrada.' });
    }

    const cards = await Card.find({ listId: list._id }).sort({ position: 1 });
    res.status(200).json(cards);
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 * /lists/{listId}/cards:
 *   post:
 *     summary: Crea una nueva tarjeta dentro de una lista
 *     tags: [Lists]
 *     parameters:
 *       - in: path
 *         name: listId
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title]
 *             properties:
 *               title: { type: string, example: "Diseñar modelo de datos" }
 *               description: { type: string }
 *               dueDate: { type: string, format: date, example: "2026-09-25" }
 *               labels:
 *                 type: array
 *                 items: { type: string }
 *                 example: ["backend", "prioridad-alta"]
 *     responses:
 *       201:
 *         description: Tarjeta creada correctamente
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Card' }
 *       400:
 *         description: Falta el campo "title" o el body es inválido
 *       404:
 *         description: No existe ninguna lista con ese listId
 */
router.post('/:listId/cards', async (req, res, next) => {
  try {
    if (!isValidObjectId(req.params.listId)) {
      return res.status(404).json({ error: 'Lista no encontrada.' });
    }

    const list = await List.findById(req.params.listId);

    if (!list) {
      return res.status(404).json({ error: 'Lista no encontrada.' });
    }

    const { title, description, dueDate, labels } = req.body || {};

    if (!title || typeof title !== 'string' || !title.trim()) {
      return res.status(400).json({ error: 'El campo "title" es requerido y debe ser un texto no vacío.' });
    }

    const existingCount = await Card.countDocuments({ listId: list._id });

    const card = await Card.create({
      listId: list._id,
      title: title.trim(),
      description: typeof description === 'string' ? description : '',
      position: existingCount + 1,
      dueDate: typeof dueDate === 'string' ? dueDate : null,
      labels: Array.isArray(labels) ? labels : [],
    });

    res.status(201).json(card);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
