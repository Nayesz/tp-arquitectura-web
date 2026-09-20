const { Types } = require('mongoose');

function isValidObjectId(id) {
  return Types.ObjectId.isValid(id);
}

module.exports = { isValidObjectId };
