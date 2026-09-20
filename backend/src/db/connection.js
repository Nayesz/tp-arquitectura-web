const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/trello';
const MAX_RETRIES = 10;
const RETRY_DELAY_MS = 3000;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function connectDB() {
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      await mongoose.connect(MONGO_URI);
      console.log(`Conectado a MongoDB (${MONGO_URI})`);
      return;
    } catch (err) {
      console.error(`Intento ${attempt}/${MAX_RETRIES} de conexión a MongoDB falló: ${err.message}`);
      if (attempt === MAX_RETRIES) {
        throw new Error('No se pudo conectar a MongoDB después de varios intentos.');
      }
      await sleep(RETRY_DELAY_MS);
    }
  }
}

module.exports = { connectDB };
