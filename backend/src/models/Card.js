const { Schema, model } = require('mongoose');

const toJSONOptions = {
  virtuals: true,
  versionKey: false,
  transform: (_doc, ret) => {
    ret.id = ret._id.toString();
    ret.listId = ret.listId.toString();
    delete ret._id;
  },
};

const cardSchema = new Schema(
  {
    listId: { type: Schema.Types.ObjectId, ref: 'List', required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    position: { type: Number, default: 0 },
    dueDate: { type: String, default: null }, // se guarda como "YYYY-MM-DD"
    labels: { type: [String], default: [] },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
    toJSON: toJSONOptions,
  }
);

module.exports = model('Card', cardSchema);
