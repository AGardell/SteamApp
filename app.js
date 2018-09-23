const express     = require("express"),
      app         = express(),
      indexRoutes = require("./routes/index.js");
      gamesRoutes = require("./routes/games.js")

app.set("view engine", "ejs");
app.use(express.static(__dirname + "public"));

app.use(indexRoutes);
app.use("/games", gamesRoutes);

app.listen(3000, () => {
    console.log("Steam App open on Port 3000!");
});