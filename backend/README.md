# Backend — Tablero tipo Trello

API REST para gestionar tableros estilo Kanban (tableros, listas y tarjetas).

## Requisitos

- Node.js >= 18
- Una instancia de MongoDB accesible (local, Docker, o Atlas)

## Base de datos

El backend persiste los datos en MongoDB usando Mongoose. La conexión se configura con la variable de entorno `MONGO_URI` (ver `.env.example`). Si no se define, usa por defecto `mongodb://localhost:27017/trello`.

Al conectar, si la colección de tableros está vacía, se carga automáticamente un set de datos de ejemplo (seed): un tablero con 3 listas y 4 tarjetas. Si ya hay datos, el seed se omite.

## Instalación

```bash
npm install
cp .env.example .env   # y ajustar MONGO_URI si hace falta
```

## Ejecución

```bash
npm start
```

Para desarrollo con auto-reload:

```bash
npm run dev
```

El servidor levanta en `http://localhost:3000` (o el puerto definido en `PORT`). **Necesita que Mongo ya esté corriendo** en la URI configurada; si no, reintenta la conexión varias veces antes de fallar.

## Ejecución con Docker

Este servicio está pensado para levantarse junto con Mongo a través del `docker-compose.yml` de la raíz del proyecto (ver README raíz). Si querés levantarlo suelto:

```bash
docker build -t trello-backend .
docker run -p 3000:3000 -e MONGO_URI=mongodb://host.docker.internal:27017/trello trello-backend
```

(`host.docker.internal` apunta a un Mongo corriendo en tu máquina host; si Mongo corre en otro contenedor, usá el nombre de ese contenedor/red en su lugar).

## Endpoints

Ver `../documentacion_api.pdf` / `../documentacion_api.md` (en la raíz del proyecto) para el detalle completo de rutas, verbos, status codes y ejemplos de body.

Prueba rápida:

```bash
curl http://localhost:3000/api/boards
```
