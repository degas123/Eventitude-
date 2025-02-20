const users = require("../controllers/user.server.controllers"),
    auth = require("../../lib/middleware");

module.exports = function (app) {
    app.route("/users")
        .post(users.create_account);

    app.route("/login")
        .post(users.login);

    app.route("/logout")
        .post(auth.isAuthenticated, users.logout);
}