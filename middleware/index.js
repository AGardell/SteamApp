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

    https.get(options, response => {
        response.setEncoding("utf8");
        const {statusCode} = response;

        if (statusCode !== 200) {
            console.log("ERROR RETRIEVING EXACT MATCH.");
            return next();
        }

        let body = "";

        response.on("data", data => {
            body += data;
        });

        response.on("end", () => {
            body = JSON.parse(body);
            if (body !== undefined && body.length > 0) {
                req.IGDBCode = body[0].id;
                next();
            }
            else {
                console.log("Could not find game. Trying to find closest match");

                /* PRACTICE WITH CALLBACKS
                getClosestMatch(gameName, options, (foundCode) => {
                    req.IGDBCode = foundCode;
                    next();
                }); */

                // PRACTICE WITH PROMISES
                const closestMatch = getClosestMatch(gameName, options);
                closestMatch
                    .then((response) => {
                        req.IGDBCode = response;
                        next();
                    })
                    .catch((err) => {
                        console.log(err);
                        next();
                    })
            }
        });
    });
};

/* PRACTICE WITH CALLBACKS
function getClosestMatch(gameName, options, callback) {
    options.path = "/games/?search=" + gameName + "&fields=id,name"

    https.get(options, response => {
        response.setEncoding("utf8");
        const {statusCode} = response;

        if (statusCode !== 200) {
            console.log("ERROR RETREIVING CLOSE MATCH.");
            callback(-1);
        }

        let body = "";

        response.on("data", data => {
            body += data;
        });

        response.on("end", () => {
            body = JSON.parse(body);
            if (body !== undefined && body.length > 0) {
                console.log("Match found!");
                callback(body[0].id);
            }
            else {
                console.log("Could not find a close match.");
                callback(-1);
            }
        });        
    });
}; */

// PRACTICE WITH PROMISES
function getClosestMatch(gameName, options, callback) {
    return new Promise((resolve, reject) => {
        options.path = "/games/?search=" + gameName + "&fields=id,name"

        https.get(options, response => {
            response.setEncoding("utf8");
            const {statusCode} = response;
    
            if (statusCode !== 200) {
                console.log("ERROR RETREIVING CLOSE MATCH.");
                //callback(-1);
                reject(statusCode);
            }
    
            let body = "";
    
            response.on("data", data => {
                body += data;
            });
    
            response.on("end", () => {
                body = JSON.parse(body);
                if (body !== undefined && body.length > 0) {
                    console.log("Match found!");
                    resolve(body[0].id);
                    //callback(body[0].id);
                }
                else {
                    console.log("Could not find a close match.");
                    reject(-1);
                }
            });        
        });
    });
};

module.exports = middlewareObj;