# Trabajo Práctico Integrador de Arquitectura Web

## Descripción
Este servidor está implementado con el módulo nativo http de Node.js. Escucha en el puerto 3000 y expone actualmente dos endpoints funcionales que serán descriptos a continuación.

## Endpoints

### 1. Verificación de estado del servidor
- Ruta: /
- Verbo HTTP: GET
- Descripción: Permite confirmar que el servidor esta activo y respondiendo.
- Body esperado: No recibe.
- Respuestas posibles:


| Código|Cuándo sucede|Content-Type| 
| --------- | --------- | -----| 
| 200  OK  |   Siempre que la solicitud sea GET a la ruta "/". El servidor responde con un mensaje a modo de 'health check' | 'text/plain':'Hola, el servidor está funcionando! :)' |
  

### 2.  Carga de archivo y conteo de bytes
- Ruta: /archivo
- Verbo HTTP: POST
- Descripción: Recibe un archivo (o cualquier contenido binario) en el body del request, cuenta la cantidad total de bytes recibidos en el payload, y responde en texto plano con ese número. 
- Body esperado: cualquier contenido binario.
- Respuestas posibles:

| Código    |  Cuándo sucede   |Content-Type| 
| --------- | --------- |-----| 
| 200  OK  |  Cuando el servidor termina de recibir el cuerpo de la solicitud (evento "end").  | 'text/plain': `Cantidad de bytes recibidos: ${totalBytes} |
  
- Ejemplo de solicitud (usando curl):
´´´
curl -X POST http://localhost:3000/archivo \
--data-binary @algun-archivo.bin 
´´´

### 3.  Ruta no encontrada (manejo por defecto)
- Ruta: cualquier ruta distinta a "/" y "/archivo"
- Verbo HTTP: Cualquiera.
- Descripción: Si la petición no se asemeja a los endpoints anteriores, por defecto, responde informando al cliente que el recurso solicitado no existe.
- Body esperado: cualquiera.
- Respuestas posibles:

| Código    |  Cuándo sucede   |Content-Type| 
| --------- | --------- |-----| 
| 404  Not Found  | Para cualquier solicitud cuya combinación de método y ruta no esté contemplada explícita  | 'text/plain' : 'Ruta no encontrada.' |
  
