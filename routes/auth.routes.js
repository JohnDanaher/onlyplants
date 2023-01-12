const router = require('express').Router();
const fileUploader = require('../config/cloudinary.config');
const User = require('../models/User.model');
const bcrypt = require('bcryptjs');
const { isLoggedOut, isLoggedIn } = require('../middlewares/routes.guard');
const Room = require('../models/Room.model');

router.get('/signup', isLoggedOut, (req, res, next) => res.render('auth/signup') );

router.post('/signup', isLoggedOut, fileUploader.single('avatar'), async (req, res, next) => {

    const { firstName, lastName, dateOfBirth, gender, location, username, email, bio, password, passwordCheck } = req.body;

    if ( !firstName || !lastName || !dateOfBirth || !location || !username || !gender || !email || !password || !passwordCheck ) { res.render('auth/signup', { errorMessage: `Please fill out all required fields.`})} 
    
    await User.findOne({ username })
            .then(user => {
                if ( user ) {
                    res.render('auth/signup', { errorMessage: `This username is already taken. Please choose another one.` })
                    return;
                }
            })
            .catch(err => console.log(err));
            
    await User.findOne({ email })
    .then(user => {
        if ( user ) {
            res.render('auth/signup', { errorMessage: `This email is already registered on our platform. Please choose another one.` })
            return;
        }
    })
    .catch(err => console.log(err));
    
    if ( password !== passwordCheck ) { res.render('auth/signup', { errorMessage: `Passwords don't match!`}); return; }
    
    const passRegex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
    if (!passRegex.test(password)) {
        res
        .status(500)
        .render('auth/signup', { errorMessage: 'Password needs to have at least 6 chars and must contain at least one number, one lowercase and one uppercase letter.' });
        return;
    }
    
    // const usernameRegex = /^[_A-z0-9]*((-|\s)*[_A-z0-9])*$/;
    const usernameRegex = /^\S+\w\S{1,}/;
    if (!usernameRegex.test(username)) {
        res
        .status(500)
        .render('auth/signup', { errorMessage: `Usernames can't contain special characters or spaces.` });
        return;
    }
    
    req.file ? avatarUrl = req.file.path : avatarUrl = 'images/profile/default-avatar.png';

    await bcrypt.hash( password, 10 )
        .then(hash => {
            return User.create({ username, email, firstName, lastName, gender, avatarUrl, dateOfBirth, location, bio, passwordHash: hash })
        })
        .then(user => {

            Room.create({ name: 'Home', slug: 'home', ownerId: user._id })
                .then(room => {
                    user.rooms.push(room._id);
                    user.save();
                })
                .catch(err => console.log(err))

            })
        .then(() => res.redirect('/auth/login'))
        .catch(err => console.log(err));

});

router.get('/login', isLoggedOut, (req, res, next) => res.render('auth/login') );

router.post('/login', isLoggedOut, (req, res, next) => {
    
    const { username, password } = req.body;

    if ( !username || !password ) {
        res.render('auth/login', { errorMessage: `Please fill out all required fields.` })
        return;
    }

    User.findOne({ username })
        .then(user => {
            if ( !user ) {
                res.render('auth/login', { errorMessage: `Wrong username and/or username.<br/>Please try again.` });
                return;
            } else if ( bcrypt.compare(user.passwordHash, password) ) {
                req.session.user = { id: user._id, username: user.username };
                res.redirect('/');
            } else {
                res.render('auth/login', { errorMessage: `Wrong username and/or username.<br/>Please try again.` });
                return;
            }
        })
        .catch(err => console.log(err));

});

router.post('/logout', isLoggedIn, (req, res, next) => { req.session.destroy(); res.redirect('/'); });

module.exports = router;