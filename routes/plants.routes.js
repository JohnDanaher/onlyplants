const express = require('express');
const router = express.Router();
const Plant = require("../models/Plant.model");
const ApiService = require('../services/api.service');
const apiService = new ApiService();


router.get("/plants/create", (req, res) => {
  res.render("plants/create");
});

router.post("/plants/create", (req, res) => {
    const {nickname, dob} = req.body;
    apiService
    .findPlant(req.body.name)
    .then((result) => {
        const details = result.data[0];
        Plant.create({
            commonName: details.common[0],
            nickname: nickname,
            // dob: dob, it doesn't seem to like this very much...
            light: details.ideallight,
            waterSchedule: details.watering,
            minTemp: details.tempmin.celsius,
            maxTemp: details.tempmax.celsius,
            toleratedLight: details.toleratedlight,
            latinName: details.latin
        })
        .then(newPlant => {
            console.log(newPlant);
        res.redirect(`/plants/details/${newPlant._id}`)
    
        })
    })
});


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
        console.log(plant);
        res.render("plants/edit", {plant})
    })
});

// router.post("/plants/edit/:id", (req, res) => {
//     const {id} = req.params;

// });

router.post("/plants/delete/:id", (req, res) => {
    const {id} = req.params;
    Plant.findByIdAndDelete(id)
    .then(() => res.redirect("/plants/create"))
});

module.exports = router;
