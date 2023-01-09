const { Schema, model } = require("mongoose");

const plantSchema = new Schema({
    nickname: String,
    dob: Date,
    parent: {
        type: Schema.Types.ObjectId,
        ref: "Parent"
    },
    room: {
        type: Schema.Types.ObjectId,
        ref: "Room"
    },
    commonName: String, // this and below: pull from api
    image_url: String, // default?
    light: String,
    toleratedLight: String,
    waterSchedule: String,
    minTemp: String,
    maxTemp: String,
    latinName: String,
})


module.exports = model("Plant", plantSchema)