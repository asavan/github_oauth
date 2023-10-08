const fetch = require("node-fetch");

const sec = "********************";
const cid = "ef25160563172c2b50ad";

function requestGithubToken(url, options) {
    return fetch(url, {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify(options),
    })
        .then((res) => res.json())
        .then((data) => {
            console.log("access_token", data);
            return data.access_token;
        });
}

function getUserData(token) {
    console.log("try get user data", token);
    return fetch("https://api.github.com/user", {
    //			mode: 'no-cors',
        headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
        },
    }).then((response) => response.json());
}

function getEmails(token) {
    console.log("try get user emails", token);
    return fetch("https://api.github.com/user/emails", {
    //			mode: 'no-cors',
        headers: {
            Authorization: "Bearer " + token,
            Accept: "application/json"
        },
    }).then((response) => response.json());
}

const routes = function (app) {
    app.get("/", (req, res) => {
        res.send(
            "<h1>Github auth</h1>"
        );
        console.log("Received GET");
    });

    app.get("/update", (req, res) => {
        const tokenUrl = "https://github.com/login/oauth/access_token";
        const tokenParams = {
            client_id: cid,
            client_secret: sec,
            code: req.query.code,
        };
        console.log("Received GET: " + JSON.stringify(req.body));

        return requestGithubToken(tokenUrl, tokenParams)
            .then((data) => getUserData(data).then((userData) => getEmails(data).then(emails => {
                userData.emails = emails;
                return userData;
            })))

            .then((d) => {
                console.log("user", d);
                return res.send(d);
                // return res.send(d);
            })
            .catch((err) => {
                console.log("error", err);
                return res.send({"status": "error", "message": "no data"});
            });
    });
};

module.exports = routes;
