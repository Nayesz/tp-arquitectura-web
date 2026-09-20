const { Router } = require('express');
const List = require('../models/List');
const Card = require('../models/Card');
const { isValidObjectId } = require('../utils/isValidObjectId');

const router = Router();

/**
 * @swagger
 * /cards/{id}:
 *   get:
 *     summary: Obtiene el detalle de una tarjeta
 *     tags: [Cards]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Tarjeta encontrada
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Card' }
 *       404:
 *         description: No existe ninguna tarjeta con ese id
 */
router.get('/:id', async (req, res, next) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(404).json({ error: 'Tarjeta no encontrada.' });
    }

    const card = await Card.findById(req.params.id);

    if (!card) {
      return res.status(404).json({ error: 'Tarjeta no encontrada.' });
    }

    res.status(200).json(card);
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 * /cards/{id}:
 *   put:
 *     summary: Actualiza los datos de una tarjeta
 *     tags: [Cards] 
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
 *               title: { type: string }
 *               description: { type: string }
 *               dueDate: { type: string, format: date }
 *               labels:
 *                 type: array
 *                 items: { type: string }
 *     responses:
 *       200:
 *         description: Tarjeta actualizada
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Card' }
 *       400:
 *         description: El body no cumple el formato esperado
 *       404:
 *         description: No existe ninguna tarjeta con ese id
 */
router.put('/:id', async (req, res, next) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(404).json({ error: 'Tarjeta no encontrada.' });
    }

    const { title, description, dueDate, labels } = req.body || {};

    if (title !== undefined && (typeof title !== 'string' || !title.trim())) {
      return res.status(400).json({ error: 'El campo "title" debe ser un texto no vacío.' });
    }

    if (labels !== undefined && !Array.isArray(labels)) {
      return res.status(400).json({ error: 'El campo "labels" debe ser un arreglo.' });
    }

    const update = {};
    if (title !== undefined) update.title = title.trim();
    if (description !== undefined) update.description = description;
    if (dueDate !== undefined) update.dueDate = dueDate;
    if (labels !== undefined) update.labels = labels;

    const card = await Card.findByIdAndUpdate(req.params.id, update, { new: true });

    if (!card) {
      return res.status(404).json({ error: 'Tarjeta no encontrada.' });
    }

    res.status(200).json(card);
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 * /cards/{id}/move:
 *   patch:
 *     summary: Mueve una tarjeta a otra lista y/o cambia su posición
 *     tags: [Cards]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [targetListId, position]
 *             properties:
 *               targetListId: { type: string }
 *               position: { type: number, example: 1 }
 *     responses:
 *       200:
 *         description: Tarjeta movida correctamente
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Card' }
 *       400:
 *         description: Faltan "targetListId" o "position", o son inválidos
 *       404:
 *         description: No existe la tarjeta o la lista destino
 */
router.patch('/:id/move', async (req, res, next) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(404).json({ error: 'Tarjeta no encontrada.' });
    }

    const { targetListId, position } = req.body || {};

    if (!targetListId || typeof position !== 'number') {
      return res.status(400).json({ error: 'Se requieren "targetListId" (string) y "position" (number).' });
    }

    if (!isValidObjectId(targetListId)) {
      return res.status(404).json({ error: 'La lista destino no existe.' });
    }

    const targetList = await List.findById(targetListId);

    if (!targetList) {
      return res.status(404).json({ error: 'La lista destino no existe.' });
    }

    const card = await Card.findByIdAndUpdate(
      req.params.id,
      { listId: targetList._id, position },
      { new: true }
    );

    if (!card) {
      return res.status(404).json({ error: 'Tarjeta no encontrada.' });
    }

    res.status(200).json(card);
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 * /cards/{id}:
 *   delete:
 *     summary: Elimina una tarjeta
 *     tags: [Cards]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       204:
 *         description: Tarjeta eliminada correctamente
 *       404:
 *         description: No existe ninguna tarjeta con ese id
 */
router.delete('/:id', async (req, res, next) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(404).json({ error: 'Tarjeta no encontrada.' });
    }

    const card = await Card.findByIdAndDelete(req.params.id);

    if (!card) {
      return res.status(404).json({ error: 'Tarjeta no encontrada.' });
    }

    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

module.exports = router;
