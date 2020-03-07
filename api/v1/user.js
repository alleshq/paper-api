const config = require("../../config");
const credentials = require("../../credentials");
const axios = require("axios");

module.exports = (req, res) => {
    var searchWithUsername;
    if (typeof req.query.id === "string") {
        searchWithUsername = false;
    } else if (typeof req.query.username === "string") {
        searchWithUsername = true;
    } else {
        return res.status(400).json({err: "invalidQueryParameters"});
    }

    axios.get(`${config.apiUrl}/user?${searchWithUsername ? `username=${encodeURIComponent(req.query.username)}` : `id=${encodeURIComponent(req.query.id)}`}`, {
        auth: {
            username: credentials.allesOAuth.id,
            password: credentials.allesOAuth.secret
        }
    }).then(response => {
        const user = response.data;
        res.json({
            id: user.id,
            username: user.username,
            name: user.name,
            about: user.about,
            plus: user.plus
        });
    }).catch(err => {
        if (err.response && err.response.data.err === "invalidUser") {
            res.status(400).json({err: "invalidUser"});
        } else {
            res.status(500).json({err: "internalError"});
        }
    });
};