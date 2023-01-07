const { isLoggedIn, isOwnProfile } = require('../middlewares/routes.guard');
const User = require('../models/User.model');
const bcrypt = require('bcryptjs');
const fileUploader = require('../config/cloudinary.config');

const router = require('express').Router();

router.get('/', isLoggedIn, (req, res, next) => res.redirect(`/profile/${ req.session.user.username }`) );

router.get('/:username', (req, res, next) => {

    const { username } = req.params;
    let userOwnProfile;

    if (req.session.user) { 
        req.session.user.username === username ? userOwnProfile = true : userOwnProfile = false; 
    }

    User.findOne({ username })
        .populate('rooms')
        .then(user => {
            if ( !user ) { res.redirect('/'); return; }
            res.render('profile/view', { user, userOwnProfile })
        })
        .catch((err => console.log(err)));

});

router.get('/:username/edit', isOwnProfile, (req, res, next) => {

    const { username } = req.params;

    User.findOne({ username })
        .then(user => {
            const dateOfBirth = user.dateOfBirth.toISOString().split('T')[0];
            res.render(`profile/edit`, { user, dateOfBirth })
        })
        .catch(err => console.log(err));


});

router.post('/:username/edit', isOwnProfile, fileUploader.single('avatar'), (req, res, next) => {
    
    const { username } = req.params;
    const { firstName, lastName, dateOfBirth, location, email, bio} = req.body;

    if (req.file) req.body.avatarUrl = req.file.path;

    User.findByIdAndUpdate( id, req.body )
        .then(() => res.redirect(`/profile/${ id }`))
        .catch(err => console.log(err));

});

module.exports = router;