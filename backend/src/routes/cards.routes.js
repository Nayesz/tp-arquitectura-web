const { Router } = require('express');
const List = require('../models/List');
const Card = require('../models/Card');
const { isValidObjectId } = require('../utils/isValidObjectId');

const router = Router();

// GET /api/cards/:id
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

// PUT /api/cards/:id
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

// PATCH /api/cards/:id/move
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

// DELETE /api/cards/:id
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
