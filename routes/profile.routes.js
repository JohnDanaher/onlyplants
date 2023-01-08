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
            user.avatarUrl.startsWith('http') ? avatarUrl = user.avatarUrl : avatarUrl = path.join(__dirname, user.avatarUrl);
            user.rooms.length != 1 ? roomsCount = `${user.rooms.length} rooms` : roomsCount = `${user.rooms.length} room`;
            user.plants.length != 1 ? plantsCount = `${user.plants.length} plants` : plantsCount = `${user.plants.length} plant`;
            res.render('profile/view', { user, avatarUrl, userOwnProfile, roomsCount, plantsCount })
        })
        .catch((err => console.log(err)));

});

router.get('/:username/edit', isOwnProfile, (req, res, next) => {

    const { username } = req.params;
    let errorMessage = false;

    if ( req.session.user.error && req.session.user.error === 'fields') {
        delete req.session.user.error;  
        errorMessage = `Please fill out all required fields.`;
    }

    User.findOne({ username })
        .then(user => {
            user.avatarUrl.startsWith('http') ? avatarUrl = user.avatarUrl : avatarUrl = path.join(__dirname, user.avatarUrl);
            const dateOfBirth = user.dateOfBirth.toISOString().split('T')[0];
            res.render(`profile/edit`, { user, avatarUrl, dateOfBirth, errorMessage })
        })
        .catch(err => console.log(err));


});

router.post('/:username/edit', isOwnProfile, fileUploader.single('avatar'), (req, res, next) => {
    
    const { username } = req.params;
    const { firstName, lastName, dateOfBirth, location, bio } = req.body;
    
    if ( !firstName || !lastName || !dateOfBirth || !location ) {
        req.session.user.error = 'fields';
        res.redirect(`/profile/${ username }/edit`);
        return;
    } 
    
    if (req.file) req.body.avatarUrl = req.file.path;

    User.findOneAndUpdate( { username }, req.body )
        .then(() => res.redirect(`/profile/${ username }`))
        .catch(err => console.log(err));

});

module.exports = router;