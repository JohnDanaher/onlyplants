const router = require('express').Router();
const { isLoggedIn, isOwnRoom } = require('../middlewares/routes.guard');
const Room = require('../models/Room.model');
const User = require('../models/User.model');
const { ObjectId } = require('mongoose').Types;


router.get('/create', isLoggedIn, async (req, res, next) => {
    const users = await User.find( {}, { username: 1, avatarUrl: 1 })
                            .catch(err => console.log(err));
    res.render('rooms/create', { users });
});

router.post('/create', isLoggedIn, async (req, res, next) => {
    const { name, inviteesList } = req.body;
    let { id } = req.session.user;
    const inviteesUsernamesArr = inviteesList.split(',');
    
    const usernamesIntoIds = inviteesUsernamesArr.map(invitee => {
        return User.findOne({ username: invitee })
        .then(user => { if (user) { return user._id } })
    });

    const inviteesIds = await Promise.all(usernamesIntoIds)

    const room = await Room.create( { name, ownerId: id } )
                        .then(room => {
                            inviteesIds.forEach(inviteeId => {
                                room.inviteesId.push(inviteeId);
                            })
                            room.save();
                            return room;
                        });

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
    
    const idsIntoUsernames = room.inviteesId.map(invitee => {
        return User.findById( invitee )
        .then(user => { if(user) { return user.username } })
    });

    const inviteesUsernames = await Promise.all(idsIntoUsernames)

    const users = await User.find( {}, { username: 1, avatarUrl: 1 })
                            .catch(err => console.log(err));

    res.render('rooms/edit', { room, users, inviteesUsernames });
});

router.post('/:roomId/edit', isOwnRoom, async (req, res, next) => {
    const { name, inviteesList } = req.body;
    const { roomId } = req.params;
    
    const inviteesUsernamesArr = inviteesList.split(',');
    const usernamesIntoIds = inviteesUsernamesArr.map(invitee => {
        return User.findOne({ username: invitee })
        .then(user => { if (user) { return user._id } });
    });
    
    const inviteesIds = await Promise.all(usernamesIntoIds)

    await Room.findByIdAndUpdate( roomId, { name, $set: { inviteesId: [] } })
        .then(room => {
            if ( inviteesList !== '' ) {
                inviteesIds.forEach(inviteeId => {
                    room.inviteesId.push(inviteeId);
                });
                room.save();
            }
        })

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