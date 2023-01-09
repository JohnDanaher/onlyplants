const { isLoggedIn, isOwnProfile } = require('../middlewares/routes.guard');
const User = require('../models/User.model');
const bcrypt = require('bcryptjs');
const fileUploader = require('../config/cloudinary.config');
const path = require('path');
const WeatherApi = require('../services/weather.service');

const router = require('express').Router();

router.get('/', isLoggedIn, (req, res, next) => res.redirect(`/profile/${ req.session.user.username }`) );

router.get('/:username', async (req, res, next) => {

    const { username } = req.params;
    let userOwnProfile;
    const weatherInformations = {};

    if (req.session.user) { 
        req.session.user.username === username ? userOwnProfile = true : userOwnProfile = false; 
    }

    const user = await User.findOne({ username })
                .populate('rooms')
                .populate('plants')
                .then(user => { if ( !user ) { res.redirect('/'); return; } return user; })
                .catch((err => console.log(err)));
    
    if ( userOwnProfile ) {
        const weatherApi = new WeatherApi();
        weatherData = await weatherApi.getWeather(user.location);
        weatherInformations.location = weatherData.data.location;
        weatherInformations.weather = weatherData.data.condition.toLowerCase();
        weatherInformations.iconUrl = weatherData.data.icon_url;
        weatherInformations.temperature = weatherData.data.feels_like_c;
    }

    user.avatarUrl.startsWith('http') ? avatarUrl = user.avatarUrl : avatarUrl = `../${user.avatarUrl}`;
    user.rooms.length != 1 ? roomsCount = `${user.rooms.length} rooms` : roomsCount = `${user.rooms.length} room`;
    user.plants.length != 1 ? plantsCount = `${user.plants.length} plants` : plantsCount = `${user.plants.length} plant`;
    
    res.render('profile/view', { user, avatarUrl, userOwnProfile, roomsCount, plantsCount, weatherInformations })

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
            user.avatarUrl.startsWith('http') ? avatarUrl = user.avatarUrl : avatarUrl = `../../${user.avatarUrl}`;
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