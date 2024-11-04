const OrderController = require('../controllers/ordersController');
const passport = require('passport');

module.exports = (app) => {
    // Traer datos
    app.get('/api/orders/findByStatus/:status',  passport.authenticate('jwt', {session: false}), OrderController.findByStatus);
    app.get('/api/orders/findByClientAndStatus/:id_client/:status',  passport.authenticate('jwt', {session: false}), OrderController.findByClientAndStatus);

    //Guardar datos
    app.post('/api/orders/create', passport.authenticate('jwt', {session: false}), OrderController.create);
    //app.post('/api/users/login', UsersController.login);

    //Actualizar datos
    //app.put('/api/users/update', passport.authenticate('jwt', {session: false}), upload.array('image', 1), UsersController.update);
    //app.put('/api/users/updateWithoutImage', passport.authenticate('jwt', {session: false}), UsersController.updateWithoutImage);
}