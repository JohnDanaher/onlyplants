const router = require('express').Router();
const { isLoggedIn, isOwnRoom } = require('../middlewares/routes.guard');
const Room = require('../models/Room.model');
const User = require('../models/User.model');
const { ObjectId } = require('mongoose').Types;


router.get('/', isLoggedIn, async (req, res, next) => {
    const { id } = req.session.user;

    User.findById( id )
        .populate({ 
            path: 'rooms',
            populate: {
                path: 'inviteesId',
                select: [ 'username', 'avatarUrl'],
                model: 'User'
            }
        })
        .then(user => {
            if ( !user ) { res.redirect('/'); return; }
            res.render('rooms/view', { user })
        })
        .catch((err => console.log(err)));
});

router.get('/create', isLoggedIn, async (req, res, next) => {
    const users = await User.find( {}, { username: 1, avatarUrl: 1 })
                            .catch(err => console.log(err));

    if ( req.session.user.error ) {
        const existingName = req.session.user.error;
        delete req.session.user.error;
        res.render('rooms/create', { users, errorMessage: `You already have a room "${ existingName }". Please choose another name.` });
        return;
    }

    res.render('rooms/create', { users });
});

router.post('/create', isLoggedIn, async (req, res, next) => {
    const { name, inviteesList } = req.body;
    let { id } = req.session.user;
    const inviteesUsernamesArr = inviteesList.split(',');
    let nameAlreadyTaken = false;

    if ( !name ) { res.render('rooms/create', { errorMessage: `Please fill out all required fields.` }); return; }
    if ( name.length < 3 ) { res.render('rooms/create', { errorMessage: `The name of the room must contain at least 3 characters.` }); return; }

    const checkRoomName = await User.findById( id )
            .populate('rooms')
            .then(user => {
                for ( i = 0 ; i < user.rooms.length ; i++ ) {
                    if ( user.rooms[i].name !== name ) continue;
                    return nameAlreadyTaken = true;
                }
            })
            .catch(err => console.log(err));

    if (nameAlreadyTaken) {
        req.session.user.error = name;
        res.redirect('/rooms/create');
        return;
    }
    
    const usernamesIntoIds = inviteesUsernamesArr.map(invitee => {
        return User.findOne({ username: invitee })
        .then(user => { if (user) { return user._id } })
    });

    const inviteesIds = await Promise.all(usernamesIntoIds)

    const room = await Room.create( { name, ownerId: id } )
                        .then(room => {
                            if (inviteesList != '') {
                                inviteesIds.forEach(inviteeId => {
                                    room.inviteesId.push(inviteeId);
                                })
                                room.save();
                            }
                            return room;
                        });

    await User.findById( id )
            .then(user => {
                user.rooms.push(room._id);
                user.save();
            })
            .catch(err => console.log(err));

    res.redirect('/rooms');
});

router.get('/:roomId', isLoggedIn, (req, res, next) => {
    const { roomId } = req.params;
    const room = Room.findById( roomId );

    res.render('rooms/view', { room });
});

router.get('/:roomId/edit', isOwnRoom, async (req, res, next) => {
    const { roomId } = req.params;
    const room = await Room.findById( roomId );
    const userId = req.session.user.id;
    
    const idsIntoUsernames = room.inviteesId.map(invitee => {
        return User.findById( invitee )
        .then(user => { if(user) { return user.username } })
    });

    const inviteesUsernames = await Promise.all(idsIntoUsernames)

    const users = await User.find( { '_id' : { '$ne' : userId  } }, { username: 1, avatarUrl: 1 })
                            .catch(err => console.log(err));
                            
    if ( req.session.user.error ) {
        const existingName = req.session.user.error;
        delete req.session.user.error;
        console.log(users)
        res.render('rooms/edit', { room, users, inviteesUsernames, errorMessage: `You already have a room "${ existingName }". Please choose another name.` });
        return;
    }

    res.render('rooms/edit', { room, users, inviteesUsernames });
});

router.post('/:roomId/edit', isOwnRoom, async (req, res, next) => {
    const { name, inviteesList } = req.body;
    const { roomId } = req.params;
    const { id } = req.session.user;
    let nameAlreadyTaken = false;

    if ( !name ) { res.render('rooms/edit', { errorMessage: `Please fill out all required fields.` }); return; }
    if ( name.length < 3 ) { res.render('rooms/edit', { errorMessage: `The name of the room must contain at least 3 characters.` }); return; }

    const checkRoomName = await User.findById( id )
            .populate('rooms')
            .then(user => {
                for ( i = 0 ; i < user.rooms.length ; i++ ) {
                    if ( user.rooms[i]._id.equals(roomId) ) continue;
                    if ( user.rooms[i].name !== name ) continue;
                    nameAlreadyTaken = true;
                    return;
                }
            })
            .catch(err => console.log(err));

    if (nameAlreadyTaken) { 
        req.session.user.error = name;
        res.redirect(`/rooms/${ roomId }/edit`);
        return;
     }
    
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

    res.redirect('/rooms');
});

router.post('/:roomId/delete', isOwnRoom, async (req, res, next) => {

    const { roomId } = req.params;

    const user = await User.findById( req.session.user.id );
    // if (user.rooms.length <= 1) { res.redirect('/profile'); return; };

    await Room.findByIdAndDelete( roomId );
    await User.findByIdAndUpdate( req.session.user.id, { $pull: { rooms: ObjectId(roomId) }});

    res.redirect('/rooms');

});

module.exports = router;