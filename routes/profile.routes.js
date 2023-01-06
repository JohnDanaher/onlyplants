const { isLoggedIn } = require('../middlewares/routes.guard');
const User = require('../models/User.model');
const bcrypt = require('bcryptjs');
const fileUploader = require('../config/cloudinary.config');

const router = require('express').Router();

router.get('/', isLoggedIn, (req, res, next) => {

    User.findById( req.session.user.id )
        .then(user => res.render('profile/view', { user }))
        .catch(err => console.log(err));

});

router.get('/:id', (req, res, next) => {

    const { id } = req.params;

    User.findById( id )
        .then(user => res.render('profile/view', { user }))
        .catch(err => console.log(err));

});

router.get('/:id/edit', (req, res, next) => {

    const { id } = req.params;

    User.findById( id )
        .then(user => {
            const dateOfBirth = user.dateOfBirth.toISOString().split('T')[0];
            res.render(`profile/edit`, { user, dateOfBirth })
        })
        .catch(err => console.log(err));


});

router.post('/:id/edit', fileUploader.single('avatar'), (req, res, next) => {
    
    const { id } = req.params;
    const { firstName, lastName, dateOfBirth, location, username, email, bio} = req.body;

    if (req.file) req.body.avatarUrl = req.file.path;

    User.findByIdAndUpdate( id, req.body )
        .then(() => res.redirect(`/profile/${ id }`))
        .catch(err => console.log(err));

});

module.exports = router;