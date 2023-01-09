const { isLoggedIn, isOwnProfile } = require('../middlewares/routes.guard');
const express = require('express');
const router = express.Router();
const Plant = require("../models/Plant.model");
const Room = require('../models/Room.model');
const User = require('../models/User.model');
const ApiService = require('../services/api.service');
const apiService = new ApiService();


router.get("/plants/create", (req, res) => {
    Room.find()
    .then(rooms => {
  res.render("plants/create", {rooms});
})
});

router.post("/plants/create", (req, res) => {
    const {nickname, room} = req.body;
    // apiService
    // .findPlant(req.body.name)
    // .then((result) => {
    //     const details = result.data[0];
        Plant.create({
            // commonName: details.common[0],
            nickname: nickname,
            room: room,
            parent: req.session.user.id
            // light: details.ideallight,
            // waterSchedule: details.watering,
            // minTemp: details.tempmin.celsius,
            // maxTemp: details.tempmax.celsius,
            // toleratedLight: details.toleratedlight,
            // latinName: details.latin
        })
        .then(newPlant => {
            Room.findById(room)
            .then(plantRoom => {
                plantRoom.plants.push(newPlant);
                plantRoom.save()
                .then(() => {
                    User.findById(req.session.user.id)
                    .then(plantDaddy => {
                        plantDaddy.plants.push(newPlant);
                        plantDaddy.save()
                    })
                .then(() => res.redirect(`/plants/details/${newPlant._id}`)
                )
            })
        })
    
        })
        
    })
// });

router.get("/plants/details/:id", (req, res) => {
    const {id} = req.params;
    Plant.findById(id)
    .then((plant) => {
        console.log(plant);
        res.render("plants/details", {plant})
    })});


router.get("/plants/edit/:id", (req, res) => {
    const {id} = req.params;
    Plant.findById(id)
    .then((plant) => {
        Room.find()
        .then((allRooms) => {
        res.render("plants/edit", {plant, allRooms})
    })
    })
});

router.post("/plants/edit/:id", (req, res) => {
    const {id} = req.params;
    const {nickname, room} = req.body;
    Plant.findByIdAndUpdate(id, {nickname, room})
    .then(updatedPlant => {
        console.log(updatedPlant);
        res.redirect(`/plants/details/${id}`)
    })

});

router.post("/plants/delete/:id", (req, res) => {
    const {id} = req.params;
    Plant.findByIdAndDelete(id)
    .then(() => res.redirect("/plants/create"))
});

module.exports = router;
