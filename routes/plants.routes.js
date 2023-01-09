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
.catch(err => console.log(err))
});

router.post("/plants/create", async (req, res) => {
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
            }   else {
                    console.log('wtf')
            }}
    }
    })
    res.redirect(`/plants/create`)

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
    Plant.findById(id)
    .then((plant) => {
        Room.find()
        .then((allRooms) => {
        res.render("plants/edit", {plant, allRooms})
    })
    })
    .catch(err => console.log(err))
});

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
    Plant.findByIdAndDelete(id)
    .then(() => res.redirect("/plants/create"))
    .catch(err => console.log(err))
});

module.exports = router;


// const {name, nickname, room} = req.body;
//     apiService
//     .findPlant()
//     .then((result) => {
//         for(let i = 0; i < result.data.length; i++){
//             let details = result.data[i];
//         if(details['Common name'][0] == name) {
//                 console.log(details['Common name'][0])
//             Plant.create({
//                 commonName: details['Common name'],
//                 nickname: nickname,
//                 room: room,
//                 image_url: details.img,
//                 parent: req.session.user.id,
//                 light: details['Light ideal'],
//                 waterSchedule: details.Watering,
//                 minTemp: details['Temperature max'].C,
//                 maxTemp: details['Temperature min'].C,
//                 toleratedLight: details['Light tolered'],
//                 latinName: details['Latin name']
//             })
//             .then(newPlant => {
//                 console.log(newPlant)
//                 Room.findById(room)
//                 .then(plantRoom => {
//                     plantRoom.plants.push(newPlant);
//                     plantRoom.save()
//                     .then(() => {
//                         User.findById(req.session.user.id)
//                         .then(plantDaddy => {
//                             plantDaddy.plants.push(newPlant);
//                             plantDaddy.save()
//                         })
//                 })
//             })
//             })
//             .catch(err => console.log(err))
//         }
//     break;
// }          
//     })