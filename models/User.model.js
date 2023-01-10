const { Schema, model, isObjectIdOrHexString } = require("mongoose");

// TODO: Please make sure you edit the User model to whatever makes sense in this case
const userSchema = new Schema(
  {
    username: {
      type: String,
      trim: true,
      required: false,
      unique: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    firstName: {
      type: String,
      trim: true,
      required: true
    },
    lastName: {
      type: String,
      trim: true,
      required: true
    },
    gender: {
      type: String,
      enum: ['parent', 'male', 'female']
    },
    avatarUrl: {
      type: String
    },
    dateOfBirth: {
      type: Date
    },
    location: {
      type: String
    },
    bio: {
      type: String
    },
    passwordHash: {
      type: String,
      required: true
    },
    rooms: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Room'
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
    // this second object adds extra properties: `createdAt` and `updatedAt`    
    timestamps: true
  }
);

const User = model("User", userSchema);

module.exports = User;
