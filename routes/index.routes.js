const express = require('express');
const router = express.Router();

/* GET home page */
router.get("/", (req, res, next) => {
  req.session.user ? res.redirect(`profile/${ req.session.user.username }`) : res.render('index');
});

module.exports = router;
