const { Schema, model } = require("mongoose");

const plantSchema = new Schema({
    nickname: String,
    parent: Schema.Types.ObjectId,
    room: Schema.Types.ObjectId,
    commonName: String, // this and below: pull from api
    image_url: {type: String, default: "https://www.dictionary.com/e/wp-content/uploads/2018/03/sideshow-bob.jpg"},
    light: String,
    toleratedLight: String,
    waterSchedule: String,
    minTemp: String,
    maxTemp: String,
    latinName: String,
})


module.exports = model("Plant", plantSchema)