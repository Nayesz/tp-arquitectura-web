const { Schema, model } = require('mongoose');

const toJSONOptions = {
  virtuals: true,
  versionKey: false,
  transform: (_doc, ret) => {
    ret.id = ret._id.toString();
    ret.boardId = ret.boardId.toString();
    delete ret._id;
  },
};

const listSchema = new Schema(
  {
    boardId: { type: Schema.Types.ObjectId, ref: 'Board', required: true },
    name: { type: String, required: true, trim: true },
    position: { type: Number, default: 0 },
  },
  { toJSON: toJSONOptions }
);

module.exports = model('List', listSchema);
