# Imagen base liviana con Node.js 18
FROM node:18-alpine

WORKDIR /app

# Copiamos primero los archivos de dependencias para aprovechar la cache de Docker
COPY package*.json ./

RUN npm install --omit=dev

# Copiamos el resto del código
COPY . .

EXPOSE 3000

CMD ["node", "server.js"]
