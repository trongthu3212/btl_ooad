
module.exports = {
    ADMIN_PERMISSIONS : {
        EDIT_ANY : true,
        DELETE_ANY: true,
        NAME: "admin"
    },

    NORMAL_USER_PERMISSIONS : {
        NAME: "user"
    },

    getRoleByName : function(name) {
        if (name == this.ADMIN_PERMISSIONS.NAME) {
            return this.ADMIN_PERMISSIONS;
        } else if (name == this.NORMAL_USER_PERMISSIONS.NAME) {
            return this.NORMAL_USER_PERMISSIONS;
        }

        return null;
    }
}

