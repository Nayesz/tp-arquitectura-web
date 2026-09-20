# Backend — Tablero 

API REST para gestionar tableros estilo Kanban (tableros, listas y tarjetas).

## Requisitos

- Node.js >= 18
- Una instancia de MongoDB accesible (local, Docker, o Atlas)

## Base de datos

El backend persiste los datos en MongoDB usando Mongoose. La conexión se configura con la variable de entorno `MONGO_URI` (ver `.env`). Si no se define, usa por defecto `mongodb://localhost:27017/tablero`.

Al conectar, se carga automáticamente un set de datos de ejemplo: un tablero con 3 listas y 4 tarjetas.

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


```bash
docker compose up --build
```


## Endpoints

Ver `../README.md` (en la raíz del proyecto) para el detalle completo de rutas, verbos, status codes y ejemplos de body. O bien ingresar a https://localhost:3000/docs

Prueba rápida:

```bash
curl http://localhost:3000/api/boards
```
