module.exports = {
    ensureLoggedIn : function(req, res, next) {
        if (!req.isAuthenticated || !req.isAuthenticated()) {
            return res.sendStatus(401);
        }
        next();
    },

    ensureLoggedOut: function(req, res, next) {
        if (req.isAuthenticated && req.isAuthenticated()) {
            return res.sendStatus(403);
        }
        next();
    }
}