const { createServer } = require('node:http');

const port = 3000;
const hostname = '0.0.0.0';

const server = createServer((req, res) => {


    if (req.method === 'GET' && req.url === '/') {
        /*
         * GET /: responde con status code 200 y un mensaje simple en texto plano, confirmando que el servidor está funcionando.
         */
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        res.end('Hola, el servidor está funcionando! :)');
        return;
    } else if (req.method === 'POST' && req.url === '/archivo') {
        /*
         * POST /archivo: recibe un archivo (o cualquier contenido binario) en el body del request,
         * cuenta la cantidad total de bytes recibidos en el payload, y responde en texto plano con ese número. 
         */
        let totalBytes = 0; // Seteamos el contador de bytes 

        req.on('data', (chunk) => { // cada vez que llega el evento 'data' se suma al contador de bytes el largo del chunk.
            totalBytes += chunk.length;
        });

    req.on('end', () => {
        res.statusCode = 200; // responde cuando el evento end confirme que no va a llegar más contenido.
        res.setHeader('Content-Type', 'text/plain');
        res.end(`Cantidad de bytes recibidos: ${totalBytes}`);
    });
    } else {
        res.statusCode = 404;
        res.setHeader('Content-Type', 'text/plain');
        res.end('Ruta no encontrada.');
    }

});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});