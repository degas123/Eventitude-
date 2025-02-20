const Users = require("../app/models/user.server.models");
const isAuthenticated = function (req, res, next) {
    console.log("test")
    let token = req.get('X-Authorization');
    console.log(token)
    Users.getIdFromToken(token, (err, id) => {
        if (err || id === null) {
            console.log(err)
            console.log(id)
            return res.sendStatus(401);
        }
        return id , next()
    });
};

module.exports = {
    isAuthenticated: isAuthenticated,
};