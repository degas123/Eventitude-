const Events = require("../models/EventManagement.server.models");
const Users = require("../models/user.server.models");
const Joi = require("joi");

const createEvents = (req, res) => {
  let token = req.get("X-Authorization");

  var Filter = require("bad-words");
  let filter = new Filter();

  Users.getIdFromToken(token, function (err, id) {
    // console.log(id);

    const schema = Joi.object({
      name: Joi.string().alphanum().required(),
      description: Joi.string().required(),
      location: Joi.string().required(),
      start: Joi.date().timestamp("unix").greater("now").required(),
      close_registration: Joi.date()
        .timestamp("unix")
        .min("now")
        .less(Joi.ref("start"))
        .required(),
      max_attendees: Joi.number().min(1).required(),
    });

    const { error } = schema.validate(req.body);

    if (error)
      return res.status(400).send({ error_message: error.details[0].message });

    console.log(error);
    let events = Object.assign({}, req.body);

    //profanity filter

    if (
      filter.isProfane(events.name) === true ||
      filter.isProfane(events.description) === true ||
      filter.isProfane(events.location) === true
    ) {
      console.log("name " + filter.isProfane(events.name));
      console.log("events.description " + filter.isProfane(events.description));
      console.log("event location " + filter.isProfane(events.location));
      return res.status(400).send({
        error_message: "Prefanity found in event posting please try agine",
      });
    }

    Events.createEvents(events, id, (err, event) => {
      console.log(err);
      if (err) {
        res.sendStatus(500);
      }
      Events.register(event.event_id, id, function (err) {
        console.log(err);
        if (err) {
          if (err.errno == 19) {
            // sqlite error for the duplication of a register for a event
            return res
              .status(403)
              .send({ error_message: "You are already registered" });
          } else {
            return res.sendStatus(500);
          }
        }
        return res.status(201).send(event);
      });
    });
  });
};

const get_event = (req, res) => {
  let event_id = parseInt(req.params.event_id);
  let token = req.get("X-Authorization");

  Users.getIdFromToken(token, function (err, id) {
    if (err || id === null) {
      console.log("User is not Authenticated");
    }
    Events.get_event(event_id, id, function (err, results) {
      if (err) {
        return res.status(500).send(err);
      } else if (!results) {
        return res.status(404).send("no results found");
      } else {
        results.questions.sort(function (a, b) {
          return b.votes ?? 0 - a.votes ?? 0;
        });

        return res.status(200).send(results);
      }
    });
  });
};

const updateEvent = (req, res) => {
  let event_id = parseInt(req.params.event_id);
  let token = req.get("X-Authorization");
  var Filter = require("bad-words"),
    filter = new Filter();
  Users.getIdFromToken(token, function (err, id) {
    console.log(id);
    console.log(err);

    let events_update = Object.assign({}, req.body);

    Events.get_event(event_id, id, function (err, results) {
      if (err) {
        return res.status(500).send(err);
      }
      if (!results) {
        return res.status(404).send("no results found");
      }
      if (id != results.creator.creator_id) {
        return res.status(403).send(" You can only update your own events");
      }
      const schema = Joi.object({
        name: Joi.string().allow(null),
        description: Joi.string().allow(null),
        location: Joi.string().allow(null),
        start: Joi.date().timestamp("unix").greater("now").allow(null),
        close_registration: Joi.date()
          .timestamp("unix")
          .min("now")
          .when("start", {
            is: Joi.exist(),
            then: Joi.date()
              .timestamp("unix")
              .min("now")
              .less(Joi.ref("start"))
              .allow(null),
            otherwise: Joi.date().timestamp("unix").min("now").allow(null),
          }),
        max_attendees: Joi.number().min(1).allow(null),
      });

      const { error } = schema.validate(req.body);

      if (!events_update.name) {
        events_update.name = results.name;
      }

      if (!events_update.description) {
        events_update.description = results.description;
      }

      if (!events_update.location) {
        events_update.location = results.location;
      }

      if (!events_update.start_date) {
        events_update.start_date = results.start;
      }

      if (!events_update.close_registration) {
        events_update.close_registration = results.close_registration;
      }

      if (!events_update.max_attendees) {
        events_update.max_attendees = results.max_attendees;
      }
      if (error) {
        console.log(error);
        return res
          .status(400)
          .send({ error_message: error.details[0].message });
      }

      if (
        filter.isProfane(events_update.name) === true ||
        filter.isProfane(events_update.description) === true ||
        filter.isProfane(events_update.location) === true
      ) {
        return res.status(400).send({
          error_message: "Prefanity found in event posting please try agine",
        });
      }
      Events.updateEvent(events_update, results.event_id, function (err) {
        // console.log(events_update);
        // console.log(results.event_id);
        if (err) {
          return res.status(500).send({ test: err });
        }
        Events.get_event(event_id, id, function (err, results_new) {
          if (err) {
            return res.status(500).send(err);
          } else if (!results) {
            return res.status(404).send("no results found");
          } else {
            // console.log("tesst");
            return res.status(200).send(results_new);
          }
        });
      });
    });
  });
};

const register = (req, res) => {
  let event_id = parseInt(req.params.event_id);
  let token = req.get("X-Authorization");
  Users.getIdFromToken(token, function (err, id) {
    if (err) return res.sendStatus(400);

    Events.get_event(event_id, id, function (err, results) {
      if (err) {
        return res.status(500).send(err);
      }
      if (!results) {
        return res.sendStatus(404);
      }
      if (results.creator.creator_id != id) {
        if (results.close_registration === -1) {
          return res
            .status(403)
            .send({ error_message: "Registration is closed" });
        }
        if (results.max_attendees === 1) {
          return res
            .status(403)
            .send({ error_message: "Event is at capacity" });
        }
        Events.register(event_id, id, function (err) {
          if (err) {
            if (err.errno == 19) {
              // sqlite error for the duplication of a register for a event
              return res
                .status(403)
                .send({ error_message: "You are already registered" });
            } else {
              return res.sendStatus(500);
            }
          }
          return res.sendStatus(200);
        });
      } else
        return res
          .status(403)
          .send({ error_message: "You are already registered" });
    });
  });
};

const deleteEvent = (req, res) => {
  let event_id = parseInt(req.params.event_id);
  let token = req.get("X-Authorization");
  Users.getIdFromToken(token, function (err, id) {
    if (!id) {
      return res.sendStatus(401);
    }
    if (err) return res.sendStatus(500);

    Events.get_event(event_id, id, function (err, results) {
      if (!results) {
        return res.status(404).send("no event");
      }
      if (err) {
        return res.status(500).send(err);
      }
      if (results.creator.creator_id == id) {
        if (results.close_registration === -1) {
          return res.status(200).send("registration closed");
        }
        Events.deleteEvent(event_id, function (err, results_deleted) {
          if (err) return res.status(500).send(err);
          return res.status(200).send({ "return ": results_deleted });
        });
      } else return res.status(403).send("You can only delete your own events");
    });
  });
};

const searchEvents = (req, res) => {
  let q = req.query.q;
  let status = req.query.status;
  let limit = isNaN(req.query.limit) ? 20 : parseInt(req.query.limit);
  let offset = isNaN(req.query.offset) ? 0 : parseInt(req.query.offset);

  const schema = Joi.object({
    q: Joi.string().uppercase(),
    status: Joi.string().valid("MY_EVENTS", "ATTENDING", "OPEN", "ARCHIVE"),
    limit: Joi.number().min(1).max(100),
    offset: Joi.number().min(0),
  });

  console.log(isNaN(req.query.limit));
  console.log(isNaN(req.query.offset));
  console.log(!req.query.limit);
  console.log(!req.query.offset);
  if (isNaN(req.query.limit || !req.query.limit)) {
    limit = 20;
    console.log("limit changed" + limit);
  }

  if (isNaN(req.query.offset || !req.query.offset)) {
    offset = 0;
    console.log("Offset changed" + offset);
  }

  let querys = {
    q: q,
    status: status,
    limit: limit,
    offset: offset,
  };
  console.log(querys);
  const { error } = schema.validate(querys);
  if (error) return res.status(400).send(error);

  let token = req.get("X-Authorization");

  Users.getIdFromToken(token, function (err, id) {
    if (err) return res.status(400).send(err);
    console.log({ id: id });

    if (!id && (status == "MY_EVENTS" || status == "ATTENDING")) {
      return res.status(400).send("not logged in ");
    }

    Events.searchEvents(querys, id, function (err, results) {
      if (err) {
        return res.status(500).send(err);
      } else if (!results) {
        return res.status(404).send("no results found");
      } else {
        return res.status(200).send(results);
      }
    });
  });
};

module.exports = {
  createEvents: createEvents,
  get_event: get_event,
  updateEvent: updateEvent,
  register: register,
  deleteEvent: deleteEvent,
  searchEvents: searchEvents,
};
