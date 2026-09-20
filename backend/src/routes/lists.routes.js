const { Router } = require('express');
const List = require('../models/List');
const Card = require('../models/Card');
const { isValidObjectId } = require('../utils/isValidObjectId');

const router = Router();

// PUT /api/lists/:id
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

// DELETE /api/lists/:id
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

// GET /api/lists/:listId/cards
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

// POST /api/lists/:listId/cards
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
