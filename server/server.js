// MODULE DE MISE EN PLACE DU SERVEUR
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

// MODULE POUR CREATION DE DOCUMENTATION
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./documentation/swagger.json');

// OPTIONS DU SERVEUR ET ROUTES
const PORT = 3000;
const api = require('./routes/api');
const server = express();


server.use(bodyParser.json());

// RACINE DE L'API
server.use('/api', api);

// ROUTE DE LA DOCUMENTATION
server.use('/documentation', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// RACINE DU SERVEUR
server.get('/', function(req, res)
{
    res.send(`
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
        <a class="navbar-brand" href="#">Serveur à l'écoute sur le port ${PORT}</a>
    </nav>
    `);
});

server.listen(PORT, function()
{
    console.log(`Serveur l'écoute sur le port: ${PORT}`);
});
