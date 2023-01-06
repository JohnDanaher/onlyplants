const express = require('express');
const router = express.Router();
const Plant = require("../models/Plant.model");

router.get("/plant/create", (req, res) => {
  res.render("plants/create");
});

router.post("/plant/create", (req, res) => {

});

router.get("/plant/details/:id", (req, res) => {
    const {id} = req.params;
});

router.get("/plant/edit/:id", (req, res) => {
    const {id} = req.params;

});

router.post("/plant/edit/:id", (req, res) => {
    const {id} = req.params;

});

router.post("/plant/delete/:id", (req, res) => {
    const {id} = req.params;

});

module.exports = router;
