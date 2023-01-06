const router = require('express').Router();
const fileUploader = require('../config/cloudinary.config');
const User = require('../models/User.model');
const bcrypt = require('bcryptjs');
const { isLoggedOut, isLoggedIn } = require('../middlewares/routes.guard');

router.get('/signup', isLoggedOut, (req, res, next) => res.render('auth/signup') );

router.post('/signup', isLoggedOut, fileUploader.single('avatar'), (req, res, next) => {

    const { firstName, lastName, dateOfBirth, location, username, email, bio, password, passwordCheck } = req.body;

    if ( password !== passwordCheck ) { res.render('auth/signup', { errorMessage: `Passwords don't match!`}); return; }
    
    req.file ? avatarUrl = req.file.path : avatarUrl = 'images/profile/default-avatar.png';

    bcrypt.hash( password, 10 )
        .then(hash => {
            User.create({ username, email, firstName, lastName, avatarUrl, dateOfBirth, location, bio, passwordHash: hash })
        })
        .then(() => res.redirect('/auth/login'))
        .catch(err => console.log(err));

});

router.get('/login', isLoggedOut, (req, res, next) => res.render('auth/login') );

router.post('/login', isLoggedOut, (req, res, next) => {
    
    const { username, password } = req.body;
    User.findOne({ username })
        .then(user => {
            if ( !user ) {
                res.render('auth/login', { errorMessage: `Wrong username.` });
                return;
            } else if ( bcrypt.compare(user.passwordHash, password) ) {
                req.session.user = { id: user._id, username: user.username };
                res.redirect('/');
            } else {
                res.render('auth/login', { errorMessage: `Wrong password.` });
                return;
            }
        })
        .catch(err => console.log(err));

});

router.post('/logout', isLoggedIn, (req, res, next) => { req.session.destroy(); res.redirect('/'); });

module.exports = router;