function handleUserAuth(req, res) {
    return res.send(`Hello ${req.user.username}!`);
}

module.exports = {
    auth: handleUserAuth
}