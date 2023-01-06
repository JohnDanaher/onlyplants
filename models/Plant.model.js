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
    image_url: String,
    light: String,
    waterSchedule: String,
    minTemp: String,
    maxTemp: String,
    toxicity: String,
    // latinName: String,
    // observation: String,
    // edible: String,

})


module.exports = model("Plant", plantSchema)