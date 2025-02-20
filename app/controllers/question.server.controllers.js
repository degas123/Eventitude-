const Question = require("../models/question.server.models");
const Users = require("../models/user.server.models");
const Events = require("../models/EventManagement.server.models");
const Joi = require("joi");

const createQuestion = (req, res) => {
  let token = req.get("X-Authorization");
  let atend = false;
  var Filter = require('bad-words')
  let filter = new Filter();

  Users.getIdFromToken(token, function (err, id) {
    const schema = Joi.object({
      question: Joi.string().required(),
    });

    const { error } = schema.validate(req.body);
    console.log(error);
    if (error)
      return res.status(400).send({ error_message: error.details[0].message });

    let qestions = Object.assign({}, req.body);
    let event_id = parseInt(req.params.event_id);
    console.log("test!!" + qestions.question, event_id);

    Events.get_event(event_id, id, function (err, results) {
      console.log("get event")
      if (err) {
        return res.status(500).send(err.message);
      }
      if (!results) {
        return res.status(401).send("no results found");
      }
      if (id === results.creator.creator_id) {
        console.log( "You cannot ask questions on your own events")
        return res
          .status(403)
          .send(" You cannot ask questions on your own events");
      }
      
      Events.is_attending(event_id, function (err, is_attending_results) {
        if (err) {
          return res.status(500).send(err.message);
        }
        if (!is_attending_results) {
          return res.status(404).send("no results found");
        }
        for (attending_use_id of is_attending_results) {
          if (attending_use_id == id) {
            atend = true;
          }
        }
        if (!atend) {
          return res
            .status(403)
            .send(" You cannot ask questions on events you are not regested");
        }

        if (
          filter.isProfane(qestions.question) === true 
        ) {
          console.log("question " + filter.isProfane(qestions.qestion))
          return res.status(400).send({
            error_message: "Prefanity found in asked qestion posting please try agein",
          });
        }

        Question.createQuestion(qestions, id, event_id, (err, qestion) => {
          if (err) return res.sendStatus(500);

          return res.status(201).send(qestion);
        });
      });
    });
  });
};

const deleteQuestion = (req, res) => {
  let question_id = parseInt(req.params.question_id);

  let token = req.get("X-Authorization");
  Users.getIdFromToken(token, function (err, id) {
    if (!id) {
      return res.sendStatus(401);
    }
    if (err) return res.sendStatus(500);
    Question.get_Question(question_id, function (err, questionResults) {
      if (!questionResults) {
        return res.status(404).send("no questions");
      }
      if (err) {
        return res.status(500).send(err);
      }

      Events.get_event(questionResults.event_id, id, function (err, results) {
        if (err) {
          return res.status(500).send(err.message);
        }
        if (!results) {
          return res.status(401).send("no results found");
        }

        console.log("TEST");
        console.log(questionResults.asked_by);

        if (
          id !== results.creator.creator_id &&
          id !== questionResults.asked_by.user_id
        ) {
          return res.sendStatus(403);
        }

        if (
          id == results.creator.creator_id ||
          id == questionResults.asked_by.user_id
        ) {
          Question.deleteQuestion(
            question_id,
            function (err, deleteQuestion_message) {
              if (err) return res.status(501).send(err);
              return res.status(200).send(deleteQuestion_message);
            }
          );
        }

        console.log(questionResults.asked_by.user_id + " asked user id");
        console.log(id);
      });
    });
  });
};

const upVoteQuestion = (req, res) => {
  let question_id = parseInt(req.params.question_id);
console.log(question_id)
  let token = req.get("X-Authorization");
  Users.getIdFromToken(token, function (err, id) {
    if (!id) {
      return res.sendStatus(401);
    }
    if (err) return res.sendStatus(500);
    Question.get_Question(question_id, function (err, questionResults) {
      if (!questionResults) {
        return res.status(404).send("no questions");
      }
      if (err) {
        return res.status(500).send(err);
      }

      console.log(question_id);
      console.log(id);
      console.log(err);
      Question.upVoteQuestion(question_id, id, function (err) {
        // console.log(err);
        if (err && err.errno == 19) {
          // sqlite error for the duplication of votes
          return res
            .status(403)
            .send({
              error_message: ` You have all ready voted on question id='${question_id}'`,
            });
        }
        if (err) return res.status(501).send(err);
        return res.status(200).send("upvotaed");
      });

    });
  });
};

const downVoteQuestion = (req, res) => {
  let question_id = parseInt(req.params.question_id);

  let token = req.get("X-Authorization");
  Users.getIdFromToken(token, function (err, id) {
    if (!id) {
      return res.sendStatus(401);
    }
    if (err) return res.sendStatus(500);
    Question.get_Question(question_id, function (err, questionResults) {
      if (!questionResults) {
        return res.status(404).send("no questions");
      }
      if (err) {
        return res.status(500).send(err);
      }


        Question.downVoteQuestion(question_id, id, function (err) {
          if (err && err.errno == 19) {
            // sqlite error for the duplication of votes
            return res
              .status(403)
              .send({
                error_message: ` You have all ready voted on question id='${question_id}'`,
              });
            }
          console.log(err)
          if (err) return res.status(501).send();


          return res.status(200).send("downvoted");
        });
      });

  });
};

module.exports = {
  createQuestion: createQuestion,
  deleteQuestion: deleteQuestion,
  upVoteQuestion: upVoteQuestion,
  downVoteQuestion: downVoteQuestion,
};
