const express = require("express"),
      http    = require("http"),
      router  = express.Router(),
      https   = require("https");


const apiKey  = "986D1366323B28EEDB9C69B5A42E99AD";

var middleware = require("../middleware/index.js");

// INDEX
router.get("/", (req,res) => {
    let steamID = req.query.steamID;
    let url = "http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=" + apiKey + "&steamid=" + steamID + "&include_appinfo=1&include_played_free_games=1&format=json";
    http.get(url, response => {
        response.setEncoding("utf8");
        const {statusCode} = response;

        if (statusCode !== 200) {
            console.log("ERROR");
            return res.redirect("/");
        }

        let body = "";

        response.on("data", data => {
            body += data;
        });

        response.on("end", () => {
            body = JSON.parse(body);
            res.render("games/index", {games: body.response.games});
        });
    });
});

// SHOW
router.get("/:gameID/:gameName", middleware.retrieveIGDBCode, (req, res) => {
    console.log(req.IGDBCode);
    const options = {
        host: "api-endpoint.igdb.com",
        path: "/games/" + req.IGDBCode,
        headers: {
            "user-key": "3c325088e51f49a94553c8519a85d113",
            "accept": "application/json"
        }
    };

    https.get(options, response => {
        response.setEncoding("utf8");
        const {statusCode} = response;

        if (statusCode !== 200) {
            console.log("ERROR: " + statusCode);
            return res.redirect("back");
        }

        let body = "";

        response.on("data", data => {
            body += data;
        });

        response.on("end", () => {
            body = JSON.parse(body);
            res.render("games/show", {gameInfo: body[0]});
        });
    });    
});

module.exports = router;