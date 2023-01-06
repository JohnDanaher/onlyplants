const express = require('express');
const router = express.Router();

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("PLANTS"); // CHANGE THIS JOHN, DO IT
});

module.exports = router;
