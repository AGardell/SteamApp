const express = require("express"),
      http    = require("http"),
      router  = express.Router();

// INDEX
router.get("/", (req, res) => {
    res.render("landing");
});

module.exports = router;