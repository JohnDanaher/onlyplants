const router = require('express').Router();
const { isLoggedIn, isOwnRoom } = require('../middlewares/routes.guard');
const Room = require('../models/Room.model');
const User = require('../models/User.model');
const { ObjectId } = require('mongoose').Types;


router.get('/create', isLoggedIn, (req, res, next) => res.render('rooms/create') )

router.post('/create', isLoggedIn, async (req, res, next) => {
    const { name } = req.body;
    let { id } = req.session.user;

    const room = await Room.create( { name, ownerId:  id });
    await User.findById( id )
            .then(user => {
                user.rooms.push(room._id);
                user.save();
            })
            .catch(err => console.log(err));

    res.redirect('/');
});

router.get('/:roomId', isLoggedIn, (req, res, next) => {
    const { roomId } = req.params;
    const room = Room.findById( roomId );

    res.render('rooms/view', { room });
});

router.get('/:roomId/edit', isOwnRoom, async (req, res, next) => {
    const { roomId } = req.params;
    const room = await Room.findById( roomId );

    res.render('rooms/edit', { room });
});

router.post('/:roomId/edit', isOwnRoom, async (req, res, next) => {
    const { name } = req.body;
    const { roomId } = req.params;

    await Room.findByIdAndUpdate( roomId, { name })
    res.redirect('/');
});

router.post('/:roomId/delete', isOwnRoom, async (req, res, next) => {

    const { roomId } = req.params;

    const user = await User.findById( req.session.user.id );
    // if (user.rooms.length <= 1) { res.redirect('/profile'); return; };

    await Room.findByIdAndDelete( roomId );
    await User.findByIdAndUpdate( req.session.user.id, { $pull: { rooms: ObjectId(roomId) }});

    res.redirect('/');

});

module.exports = router;