let express = require('express')

function handleGetExecute(req, res) {
    let message = "This is a test!";
    if (req.query.secret != null) {
        message = "This is your secret text: " + req.query.secret;
    }
    return res.json({
        message: message
    });
}

module.exports = {
    execute: handleGetExecute
}