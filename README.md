# Documentación de la API — Tablero tipo Trello

## Descripción general del backend

El backend implementa el servicio de una aplicación de gestión de tableros estilo Kanban
(similar a Trello). Resuelve el problema de organizar tareas de forma visual, permitiendo
agrupar el trabajo en tableros, cada uno dividido en listas (columnas, por ejemplo "Por hacer",
"En progreso", "Hecho"), donde se ubican tarjetas que representan las tareas concretas.

La API expone endpoints REST para crear y administrar tableros, listas y tarjetas, mover
tarjetas entre listas, y obtener un reporte estadístico del estado de cada tablero (cantidad de
tarjetas por lista y tarjetas vencidas)




## Documentación de cada endpoint

**Base URL:** `/api`

## Boards

### `GET /api/boards`
- **Verbo HTTP:** GET
- **Propósito:** Devuelve la lista completa de tableros existentes.
- **Códigos de estado posibles:**
  - `200 OK`: la solicitud fue exitosa y se devuelve el arreglo de tableros (puede estar vacío).

---

### `POST /api/boards`
- **Verbo HTTP:** POST
- **Propósito:** Crea un nuevo tablero.
- **Body esperado:**
```json
{
  "name": "Proyecto TP Integrador",
  "description": "Tablero para organizar las tareas del trabajo práctico"
}
```
- **Códigos de estado posibles:**
  - `201 Created`: el tablero se creó correctamente; se devuelve el recurso creado con su `id`.
  - `400 Bad Request`: falta el campo `name` o el body no tiene el formato esperado.

---

### `GET /api/boards/:id`
- **Verbo HTTP:** GET
- **Propósito:** Obtiene el detalle de un tablero específico.
- **Códigos de estado posibles:**
  - `200 OK`: el tablero existe y se devuelve su información.
  - `404 Not Found`: no existe ningún tablero con el `id` indicado.

---

### `PUT /api/boards/:id`
- **Verbo HTTP:** PUT
- **Propósito:** Actualiza el nombre y/o la descripción de un tablero existente.
- **Body esperado:**
```json
{
  "name": "Proyecto TP Integrador v2",
  "description": "Descripción actualizada"
}
```
- **Códigos de estado posibles:**
  - `200 OK`: la actualización fue exitosa; se devuelve el recurso actualizado.
  - `400 Bad Request`: el body no cumple el formato esperado (por ejemplo, `name` vacío).
  - `404 Not Found`: no existe ningún tablero con el `id` indicado.

---

### `DELETE /api/boards/:id`
- **Verbo HTTP:** DELETE
- **Propósito:** Elimina un tablero junto con todas sus listas y tarjetas asociadas.
- **Códigos de estado posibles:**
  - `204 No Content`: el tablero se eliminó correctamente (no se devuelve contenido en el body).
  - `404 Not Found`: no existe ningún tablero con el `id` indicado.

---

## Lists

### `GET /api/boards/:boardId/lists`
- **Verbo HTTP:** GET
- **Propósito:** Devuelve todas las listas (columnas) pertenecientes a un tablero.
- **Códigos de estado posibles:**
  - `200 OK`: se devuelve el arreglo de listas del tablero (puede estar vacío).
  - `404 Not Found`: no existe ningún tablero con el `boardId` indicado.

---

### `POST /api/boards/:boardId/lists`
- **Verbo HTTP:** POST
- **Propósito:** Crea una nueva lista dentro de un tablero.
- **Body esperado:**
```json
{
  "name": "En progreso",
  "position": 2
}
```
- **Códigos de estado posibles:**
  - `201 Created`: la lista se creó correctamente dentro del tablero indicado.
  - `400 Bad Request`: falta el campo `name` o el body no tiene el formato esperado.
  - `404 Not Found`: no existe ningún tablero con el `boardId` indicado.

---

### `PUT /api/lists/:id`
- **Verbo HTTP:** PUT
- **Propósito:** Actualiza el nombre y/o la posición de una lista existente.
- **Body esperado:**
```json
{
  "name": "En revisión",
  "position": 3
}
```
- **Códigos de estado posibles:**
  - `200 OK`: la actualización fue exitosa; se devuelve el recurso actualizado.
  - `400 Bad Request`: el body no cumple el formato esperado.
  - `404 Not Found`: no existe ninguna lista con el `id` indicado.

---

### `DELETE /api/lists/:id`
- **Verbo HTTP:** DELETE
- **Propósito:** Elimina una lista junto con todas las tarjetas que contiene.
- **Códigos de estado posibles:**
  - `204 No Content`: la lista se eliminó correctamente.
  - `404 Not Found`: no existe ninguna lista con el `id` indicado.

---

## Cards

### `GET /api/lists/:listId/cards`
- **Verbo HTTP:** GET
- **Propósito:** Devuelve todas las tarjetas pertenecientes a una lista.
- **Códigos de estado posibles:**
  - `200 OK`: se devuelve el arreglo de tarjetas de la lista (puede estar vacío).
  - `404 Not Found`: no existe ninguna lista con el `listId` indicado.

---

### `POST /api/lists/:listId/cards`
- **Verbo HTTP:** POST
- **Propósito:** Crea una nueva tarjeta dentro de una lista.
- **Body esperado:**
```json
{
  "title": "Diseñar modelo de datos",
  "description": "Definir entidades Board, List y Card",
  "dueDate": "2026-09-20",
  "labels": ["backend", "prioridad-alta"]
}
```
- **Códigos de estado posibles:**
  - `201 Created`: la tarjeta se creó correctamente dentro de la lista indicada.
  - `400 Bad Request`: falta el campo `title` o el body no tiene el formato esperado.
  - `404 Not Found`: no existe ninguna lista con el `listId` indicado.

---

### `GET /api/cards/:id`
- **Verbo HTTP:** GET
- **Propósito:** Obtiene el detalle de una tarjeta específica.
- **Códigos de estado posibles:**
  - `200 OK`: la tarjeta existe y se devuelve su información.
  - `404 Not Found`: no existe ninguna tarjeta con el `id` indicado.

---

### `PUT /api/cards/:id`
- **Verbo HTTP:** PUT
- **Propósito:** Actualiza los datos de una tarjeta (título, descripción, fecha de vencimiento, etiquetas).
- **Body esperado:**
```json
{
  "title": "Diseñar modelo de datos (revisado)",
  "description": "Definir entidades y sus relaciones",
  "dueDate": "2026-09-25",
  "labels": ["backend"]
}
```
- **Códigos de estado posibles:**
  - `200 OK`: la actualización fue exitosa; se devuelve el recurso actualizado.
  - `400 Bad Request`: el body no cumple el formato esperado.
  - `404 Not Found`: no existe ninguna tarjeta con el `id` indicado.

---

### `PATCH /api/cards/:id/move`
- **Verbo HTTP:** PATCH
- **Propósito:** Mueve una tarjeta a otra lista y/o cambia su posición dentro de la lista actual.
- **Body esperado:**
```json
{
  "targetListId": "2",
  "position": 1
}
```
- **Códigos de estado posibles:**
  - `200 OK`: la tarjeta se movió correctamente; se devuelve el recurso actualizado.
  - `400 Bad Request`: el body no incluye `targetListId` o `position`, o tiene un formato inválido.
  - `404 Not Found`: no existe la tarjeta indicada o la lista destino (`targetListId`) no existe.

---

### `DELETE /api/cards/:id`
- **Verbo HTTP:** DELETE
- **Propósito:** Elimina una tarjeta.
- **Códigos de estado posibles:**
  - `204 No Content`: la tarjeta se eliminó correctamente.
  - `404 Not Found`: no existe ninguna tarjeta con el `id` indicado.

---

## Reportes

### `GET /api/boards/:boardId/report`
- **Verbo HTTP:** GET
- **Propósito:** Devuelve estadísticas del tablero: cantidad de tarjetas agrupadas por lista, total de tarjetas y cantidad de tarjetas vencidas (con `dueDate` anterior a la fecha actual).
- **Ejemplo de respuesta:**
```json
{
  "boardId": "1",
  "boardName": "Proyecto TP Integrador",
  "cardsPerList": [
    { "listId": "1", "listName": "Por hacer", "count": 5 },
    { "listId": "2", "listName": "En progreso", "count": 2 },
    { "listId": "3", "listName": "Hecho", "count": 8 }
  ],
  "totalCards": 15,
  "overdueCards": 3
}
```
- **Códigos de estado posibles:**
  - `200 OK`: el reporte se generó correctamente.
  - `404 Not Found`: no existe ningún tablero con el `boardId` indicado.



### Modelo de datos

**Board**
```json
{
  "id": "string",
  "name": "string",
  "description": "string",
  "createdAt": "ISO 8601 date"
}
```

**List**
```json
{
  "id": "string",
  "boardId": "string",
  "name": "string",
  "position": "number"
}
```

**Card**
```json
{
  "id": "string",
  "listId": "string",
  "title": "string",
  "description": "string",
  "position": "number",
  "dueDate": "ISO 8601 date | null",
  "labels": ["string"],
  "createdAt": "ISO 8601 date"
}
```
