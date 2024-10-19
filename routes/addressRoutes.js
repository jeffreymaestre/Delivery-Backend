const AddressController = require('../controllers/addressController');
const passport = require('passport');

module.exports = (app) => {
    // Traer datos
    //app.get('/api/categories/getAll',  passport.authenticate('jwt', {session: false}), CategoriesController.getAll);

    //Guardar datos
    app.post('/api/address/create', passport.authenticate('jwt', {session: false}), AddressController.create);
    //app.post('/api/users/login', UsersController.login);

    //Actualizar datos
    //app.put('/api/users/update', passport.authenticate('jwt', {session: false}), upload.array('image', 1), UsersController.update);
    //app.put('/api/users/updateWithoutImage', passport.authenticate('jwt', {session: false}), UsersController.updateWithoutImage);
}