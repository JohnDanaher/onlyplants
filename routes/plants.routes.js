const { isLoggedIn, isOwnProfile } = require('../middlewares/routes.guard');
const express = require('express');
const router = express.Router();
const Plant = require("../models/Plant.model");
const Room = require('../models/Room.model');
const User = require('../models/User.model');
const ApiService = require('../services/api.service');
const apiService = new ApiService();


router.get("/plants/create", (req, res) => {
    User.findById(req.session.user.id)
    .populate('rooms')
    .then( foundUser => {
        console.log('User', foundUser)
        res.render('plants/create', foundUser)
    })
    .catch(error => console.log(error))
});


router.post("/plants/create", async (req, res) => {
    const {username} = req.session.user;
    const {name, nickname, room} = req.body;

    await apiService
    .findPlant()
    .then(result => {
        for(i = 0; i < result.data.length; i++){
            let details = result.data[i]
            if(details['Common name']){
                if(details['Common name'].includes(name)){
                console.log(details['Common name'][0]);
                Plant.create({
                commonName: details['Common name'][0],
                nickname: nickname,
                room: room,
                image_url: details.img,
                parent: req.session.user.id,
                light: details['Light ideal'],
                waterSchedule: details.Watering,
                minTemp: details['Temperature max'].C,
                maxTemp: details['Temperature min'].C,
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

router.get("/plants/edit/:id", (req, res) => {
    const {id} = req.params;
    const plant = Plant.findById(id)
    
    User.findById(req.session.user.id)
    .populate('rooms')
    .then( foundUser => {
        res.render('plants/edit', {plant, foundUser})
    })
    .catch(error => console.log(error))
    // Plant.findById(id)
    // .then((plant) => {
    //     Room.find()
    //     .then((allRooms) => {
    //     res.render("plants/edit", {plant, allRooms})
    // })
    // })
    // .catch(err => console.log(err))
});


// router.get("/plants/edit/:id", (req, res) => {
//     const {id} = req.params;
//     Plant.findById(id)
//     .then((plant) => {
//         User.findById(req.session.user.id)
//         .populate('rooms')
//         .then( foundUser => {
//             console.log(plant)
//             res.render('plants/create', {plant, foundUser})
//         })
//     .catch(err => console.log(err))
//     })
// })

router.post("/plants/edit/:id", (req, res) => {
    const {id} = req.params;
    const {nickname, room} = req.body;
    Plant.findByIdAndUpdate(id, {nickname, room})
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

