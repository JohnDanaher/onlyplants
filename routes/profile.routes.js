const { isLoggedIn, isOwnProfile } = require('../middlewares/routes.guard');
const User = require('../models/User.model');
const bcrypt = require('bcryptjs');
const fileUploader = require('../config/cloudinary.config');
const path = require('path');
const WeatherApi = require('../services/weather.service');
const Room = require('../models/Room.model');
const { populate } = require('../models/User.model');

const router = require('express').Router();

router.get('/', isLoggedIn, (req, res, next) => res.redirect(`/profile/${ req.session.user.username }`) );

router.get('/:username', async (req, res, next) => {

    const { username } = req.params;
    let userOwnProfile;
    const weatherInformations = {};
    const sessionSpecificData = {};

    if (req.session.user) { 
        req.session.user.username === username ? userOwnProfile = true : userOwnProfile = false; 
    }

    const user = await User.findOne({ username })
                .populate('rooms')
                .populate({
                    path: 'plants',
                    populate: {
                        path: 'room',
                        model: 'Room'
                    }
                })
                .catch(err => console.log(err));

    if ( !user ) { res.redirect('/'); return; };
    
    if ( userOwnProfile ) {

        // fetch weather data based on user's location - based on the params username / but only if own profile
        const weatherApi = new WeatherApi();
        weatherData = await weatherApi.getWeather(user.location);
        sessionSpecificData.weatherLocation = weatherData.data.location;
        sessionSpecificData.weatherConditions = weatherData.data.condition;
        sessionSpecificData.weatherIconUrl = weatherData.data.icon_url;
        sessionSpecificData.weatherTemperature = weatherData.data.feels_like_c;

        // query all plants from rooms the logged in user is invited in to display on their profile under the tab "friends' rooms"
        const myFriendsRooms = await Room.find({ ownerId: { $ne : req.session.user.id } , 'inviteesId' : { $in: [req.session.user.id] } })
                                .populate('plants')
                                .catch(err => console.log(err));
        sessionSpecificData.friendsRooms = myFriendsRooms;

    }
    
    if ( !userOwnProfile ) {
        // get user's rooms - based on req params username - and only query rooms the logged in user is invited in
        const roomsIAminvitedIn = await Room.find({ ownerId: user._id , 'inviteesId' : { $in: [req.session.user.id] } })
                                    .populate('plants')
                                    .catch(err => console.log(err));
        sessionSpecificData.allowedRooms = roomsIAminvitedIn;
    }

    user.avatarUrl.startsWith('http') ? avatarUrl = user.avatarUrl : avatarUrl = `../${user.avatarUrl}`;
    user.rooms.length != 1 ? roomsCount = `${user.rooms.length} rooms` : roomsCount = `${user.rooms.length} room`;
    user.plants.length != 1 ? plantsCount = `${user.plants.length} plants` : plantsCount = `${user.plants.length} plant`;
    
    res.render('profile/view', { user, avatarUrl, userOwnProfile, roomsCount, plantsCount, sessionSpecificData })

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