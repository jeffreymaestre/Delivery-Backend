const OrderController = require('../controllers/ordersController');
const passport = require('passport');

module.exports = (app) => {
    // Traer datos
    //app.get('/api/address/findByUser/:id_user',  passport.authenticate('jwt', {session: false}), AddressController.findByUser);

    //Guardar datos
    app.post('/api/orders/create', passport.authenticate('jwt', {session: false}), OrderController.create);
    //app.post('/api/users/login', UsersController.login);

    //Actualizar datos
    //app.put('/api/users/update', passport.authenticate('jwt', {session: false}), upload.array('image', 1), UsersController.update);
    //app.put('/api/users/updateWithoutImage', passport.authenticate('jwt', {session: false}), UsersController.updateWithoutImage);
}