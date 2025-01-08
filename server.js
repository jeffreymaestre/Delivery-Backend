const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const logger = require('morgan');
const cors = require('cors');
const passport = require('passport');
const multer = require('multer');
//const serviceAccount = require('./serviceAccountKey.json');
const serviceAccount = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON);
const admin = require('firebase-admin');
const io = require('socket.io')(server);
const ordersDeliverySocket = require('./sockets/orders_delivery_socket');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const upload = multer({
    storage: multer.memoryStorage()
});

/*
RUTAS
 */
const users = require('./routes/usersRoutes');
const categories = require('./routes/categoriesRoutes');
const products = require('./routes/productRoutes');
const address = require('./routes/addressRoutes');
const orders = require('./routes/ordersRoutes');

const port = process.env.port || 3000;
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));
app.use(cors());
app.use(passport.initialize())
app.use(passport.session())

require('./config/passport')(passport);

app.disable('x-powered-by');

app.set('port', port);

/*
LLAMANDO A LAS RUTAS
*/
users(app, upload);
categories(app, upload);
products(app, upload);
address(app); //prueba
orders(app); //prueba

/*
LLAMAR A SOCKETS
*/
ordersDeliverySocket(io);

server.listen(port, function(){
    console.log('Listening on port ' + port + ' Iniciando...')
});
/*server.listen(3000, '192.168.56.1' || 'localhost', function(){
    console.log('Aplicacion de node.js ' + port + ' iniciando...')
});*/

// ERROR HANDLER
app.use((err, req, res, next) => {
    console.log(err);
    res.status(err.status || 500).send(err.stack);
});

module.exports = {
    app: app,
    server: server
}