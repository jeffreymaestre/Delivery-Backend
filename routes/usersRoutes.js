const UsersController = require('../controllers/usersController');
const passport = require('passport');

module.exports = (app, upload) => {
    // Traer datos
    app.get('/api/users/getAll', UsersController.getAll);

    //Guardar datos
    app.post('/api/users/create', UsersController.register);
    app.post('/api/users/login', UsersController.login);

    //Actualizar datos
    app.put('/api/users/update', passport.authenticate('jwt', {session: false}), upload.array('image', 1), UsersController.update);
    app.put('/api/users/updateWithoutImage', passport.authenticate('jwt', {session: false}), UsersController.updateWithoutImage);
}