const CategoriesController = require('../controllers/categoriesController');
const passport = require('passport');

module.exports = (app, upload) => {
    // Traer datos
    app.get('/api/categories/getAll',  passport.authenticate('jwt', {session: false}), CategoriesController.getAll);

    //Guardar datos
    app.post('/api/categories/create', passport.authenticate('jwt', {session: false}), upload.array('image', 1), CategoriesController.create);
    //app.post('/api/users/login', UsersController.login);

    //Actualizar datos
    //app.put('/api/users/update', passport.authenticate('jwt', {session: false}), upload.array('image', 1), UsersController.update);
    //app.put('/api/users/updateWithoutImage', passport.authenticate('jwt', {session: false}), UsersController.updateWithoutImage);
}