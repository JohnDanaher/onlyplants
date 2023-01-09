const { Schema, model } = require("mongoose");

const roomModel = new Schema(
{

    name: {
        type: String
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
},
{
  timestamps: true
}
);

module.exports = model("Room", roomSchema)