const { isLoggedIn, isOwnProfile } = require('../middlewares/routes.guard');
const express = require('express');
const router = express.Router();
const fileUploader = require('../config/cloudinary.config');
const Plant = require("../models/Plant.model");
const Room = require('../models/Room.model');
const User = require('../models/User.model');
const ApiService = require('../services/api.service');
const apiService = new ApiService();


router.get("/plants/create", (req, res) => {
    User.findById(req.session.user.id)
    .populate('rooms')
    .then( foundUser => {
        res.render('plants/create', foundUser)
    })
    .catch(error => console.log(error))
});


router.post("/plants/create", fileUploader.single('avatar'), async (req, res) => {
    const {username} = req.session.user;
    const {name, nickname, room} = req.body;
    let plantAvatar;

    await apiService
    .findPlant()
    .then(result => {
        for(i = 0; i < result.data.length; i++){
            let details = result.data[i]
            if(details['Common name']){
                if(details['Common name'].includes(name)){
                req.file ? plantAvatar = req.file.path : plantAvatar = details.img;
                Plant.create({
                commonName: details['Common name'][0],
                nickname: nickname,
                room: room,
                image_url: plantAvatar,
                parent: req.session.user.id,
                light: details['Light ideal'],
                waterSchedule: details.Watering,
                minTemp: details['Temperature min'].C,
                maxTemp: details['Temperature max'].C,
                toleratedLight: details['Light tolered'],
                latinName: details['Latin name']
            })
            .then(newPlant => {
                console.log(newPlant)
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
                })
            })
            })
            .catch(err => console.log(err))
            break;
            }}
    }
    })
    .then(() => res.redirect(`/profile/${username}`))

    });       

router.get("/plants/details/:id", (req, res) => {
    const {id} = req.params;
    Plant.findById(id)
    .then((plant) => {
        console.log(plant);
        res.render("plants/details", {plant})
    })
    .catch(err => console.log(err))
});

router.get("/plants/edit/:id", async (req, res) => {
    const {id} = req.params;
    const plant = await Plant.findById(id)
    const user = await User.findById(req.session.user.id).populate('rooms')
        
    res.render("plants/edit", {plant, rooms: user.rooms})

});



router.post("/plants/edit/:id", fileUploader.single('avatar'), (req, res) => {
    const {id} = req.params;
    const {nickname, room} = req.body;
    if (req.file) req.body.image_url = req.file.path;

    Plant.findByIdAndUpdate(id, req.body)
    .then(updatedPlant => {
        console.log(updatedPlant);
        res.redirect(`/plants/details/${id}`)
    })
    .catch(err => console.log(err))
});

router.post("/plants/delete/:id", (req, res) => {
    const {id} = req.params;
    const {username} = req.session.user;
    Plant.findByIdAndDelete(id)
    .then((plant) => {
        Room.findByIdAndUpdate(plant.room._id, {$pull: {plants: { $in: id}}})
        .then(() => {
            User.findByIdAndUpdate(plant.parent._id, {$pull: {plants: { $in: id}}})
            .then(() => {
                res.redirect(`/profile/${username}`)})
                 .catch(err => console.log(err))
            })
        })
});

module.exports = router;

