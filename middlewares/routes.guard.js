const User = require("../models/User.model");
const { ObjectId } = require('mongoose').Types;

const isLoggedIn = (req, res, next) => {
    if (!req.session.user) { res.redirect('/'); return; }
    next();
}

const isLoggedOut = (req, res, next) => {
    if (req.session.user) { res.redirect('/'); return; }
    next();
}

const isOwnProfile = (req, res, next) => {
    if ( !req.session.user ) { res.redirect('/'); return; }
    if ( req.session.user.username !== req.params.username ) return;
    next();
}

const isOwnRoom = async (req, res, next) => {
    if ( !req.session.user ) { res.redirect('/'); return; }

    const user = await User.findById( req.session.user.id );
    if ( !user.rooms.includes( ObjectId(req.params.roomId) ) ) { res.redirect('/'); return; }

    next();
}

module.exports = { isLoggedIn, isLoggedOut, isOwnProfile, isOwnRoom};