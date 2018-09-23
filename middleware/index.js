const https = require("https");

middlewareObj = {};

middlewareObj.retrieveIGDBCode = function (req, res, next){
    let gameName = req.params.gameName;
    gameName = gameName.replace(/™/g, "");
    gameName = gameName.replace(/ /g, "%20");
    //console.log(gameName);

    const options = {
        host: "api-endpoint.igdb.com",
        path: "/games/?filter[name][eq]=" + gameName + "&fields=id,name",
        headers: {
            "user-key": "3c325088e51f49a94553c8519a85d113",
            "accept": "application/json"
        }
    };

    console.log(options.path);

    https.get(options, response => {
        response.setEncoding("utf8");
        const {statusCode} = response;

        if (statusCode !== 200) {
            console.log("ERROR");
            return next();
        }

        let body = "";

        response.on("data", data => {
            body += data;
        });

        response.on("end", () => {
            body = JSON.parse(body);
            req.IGDBCode = body[0].id;
            next();
        });
    });
};

module.exports = middlewareObj;