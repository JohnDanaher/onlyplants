const { model, Schema } = require('mongoose');

const roomSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        required: true
    },
    ownerId: Schema.Types.ObjectId,
    inviteesId: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    plants: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Plant'
        }
    ]
});

const Room = model('Room', roomSchema);

module.exports = Room;
