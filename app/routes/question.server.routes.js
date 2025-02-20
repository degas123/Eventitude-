const questions = require("../controllers/question.server.controllers");
const auth = require("../../lib/middleware");

module.exports = function (app) {
    app.route("/event/:event_id/question")
        .post(auth.isAuthenticated, questions.createQuestion);

    app.route("/question/:question_id")
        .delete(auth.isAuthenticated,questions.deleteQuestion);

    app.route("/question/:question_id/vote")
        .post(auth.isAuthenticated,questions.upVoteQuestion); 

    app.route("/question/:question_id/vote")
        .delete(auth.isAuthenticated,questions.downVoteQuestion);    
}