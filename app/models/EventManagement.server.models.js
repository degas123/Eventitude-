const db = require("../../database");

const createEvents = (event, id, done) => {
  const sql =
    "INSERT INTO events (name, description ,location ,start_date ,close_registration,max_attendees,creator_id) VALUES (?,?,?,?,?,?,?)";
  let events = [
    event.name,
    event.description,
    event.location,
    event.start,
    event.close_registration,
    event.max_attendees,
    id,
  ];

  db.run(sql, events, function (err) {
    if (err) return done(err);

    return done(err, {
      event_id: this.lastID,
    });
  });
};

const get_event = (event_id, user_id, done) => {
  let query = `SELECT * FROM events INNER JOIN (SELECT user_id, first_name, last_name, email from users) 
        as users ON events.creator_id = users.user_id
        WHERE event_id=?`;

  let query2 = `SELECT * 
        FROM attendees a, users u 
        WHERE a.event_id=?
        AND a.user_id = u.user_id`;

  let query3_get_qestion = `SELECT * 
        FROM questions q, events e , users u
        WHERE e.event_id=?
        AND q.event_id = e.event_id
		and q.asked_by = u.user_id`;
  const attendee = [];
  const question = [];
  db.get(query, [event_id], (err, row) => {
    if (err) return done(err);
    if (!row) return done(err);
    if (row != null) {
      let event = row;

      let to_return = {
        event_id: event.event_id,
        creator: {
          creator_id: event.creator_id,
          first_name: event.first_name,
          last_name: event.last_name,
          email: event.email,
        },
        name: event.name,
        description: event.description,
        location: event.location,
        start: event.start_date,
        close_registration: event.close_registration,
        max_attendees: event.max_attendees,
        number_attending: event.number_attending,
        attendees: attendee,
        questions: question,
      };
// this gets query gets the attendes if there are any in the data base if not rteturns the event wiout the attendies,
      db.all(query2, [event_id], (err, row) => {

        let attendees_info = row;
        if (err) {
          return done(err);
        }

        let attendees_list = [];
        count = 0;

        for (i = 0; i < row.length; i++) {
          attendees_list.push({
            user_id: attendees_info[i].user_id,
            first_name: attendees_info[i].first_name,
            last_name: attendees_info[i].last_name,
            email: attendees_info[i].email,
          });

          count++;
        }

        to_return["number_attending"] = row.length;

        if (user_id && user_id === event.creator_id) {
          to_return["attendees"] = attendees_list;
          attendee.push(to_return["attendees"]);

        } else {
          to_return = {
            event_id: event.event_id,
            creator: {
              creator_id: event.creator_id,
              first_name: event.first_name,
              last_name: event.last_name,
              email: event.email,
            },
            name: event.name,
            description: event.description,
            location: event.location,
            start: event.start_date,
            close_registration: event.close_registration,
            max_attendees: event.max_attendees,
            number_attending: event.number_attending,
            questions: question,
          };
          to_return["number_attending"] = row.length;
        }

        db.all(query3_get_qestion, [event_id], (err, row) => {
          if (err) return done(err);
          if (row != null) {
            let question_list = [];
            for (i = 0; i < row.length; i++) {
              question_list.push({
                question_id: row[i].question_id,
                question: row[i].question,
                votes: row[i].votes,
                asked_by: {
                  user_id: row[i].user_id,
                  first_name: row[i].first_name,
                },
              });
            }
            to_return["questions"] = question_list;
            question.push(to_return["questions"]);
          }
          return done(err, to_return);
        });
      });
    }
  });
};

const is_attending = (event_id, done) => {
  let query1 = `SELECT a.user_id
                FROM attendees a
                WHERE a.event_id = ?`;

  db.all(query1, [event_id], (err, row) => {
    if (err) return done(err);
    if (row != null) {
      let att_id = [];
      for (i = 0; i < row.length; i++) {
        att_id.push(row[i].user_id);
      }
      return done(err, att_id);
    }
  });
};

const updateEvent = (event, id, done) => {
  const sql =
    "UPDATE events SET name=? , description=? ,location=? ,start_date=? ,close_registration=? ,max_attendees=?  WHERE event_id=? ";
  let events = [
    event.name,
    event.description,
    event.location,
    event.start_date,
    event.close_registration,
    event.max_attendees,
    id,
  ];

  db.run(sql, events, function (err) {
    if (err) return done(err);
    return done(null);
  });
};

const register = (event_id, user_id, done) => {
  console.log("event: " + event_id);
  console.log("user: " + user_id);
  let query = "INSERT INTO attendees (event_id, user_id) VALUES (?,?)";
  db.run(query, [event_id, user_id], function (err) {
    if (err) return done(err);
    return done(err);
  });
};

const deleteEvent = (event_id, done) => {
  let sql = "UPDATE events SET close_registration=-1 WHERE event_id=?";
  db.run(sql, [event_id], (err) => {
    if (err) return done(err);
    return done(err, "event deleted");
  });
};

const searchEvents = (search, id, done) => {
  if (!id && !search.q && !search.status) {
    console.log("test1");
    searchReqest =
      `SELECT * FROM events e LIMIT ` +
      search.limit +
      " OFFSET " +
      search.offset;
  } else if (id && search.status == "MY_EVENTS") {
    console.log("test2");
    searchReqest =
      "SELECT * FROM events e WHERE e.creator_id= " +
      id +
      " LIMIT " +
      search.limit +
      " OFFSET " +
      search.offset;
  } else if (id && search.status == "ATTENDING") {
    searchReqest =
      "SELECT DISTINCT * FROM  events e , attendees a WHERE e.creator_id != a.user_id and a.event_id = e.event_id AND a.user_id =" +
      id +
      " LIMIT " +
      search.limit +
      " OFFSET " +
      search.offset;
    console.log("test3");
  } else if (search.status == "ARCHIVE" && !search.q) {
    searchReqest =
      "SELECT * FROM  events e WHERE e.close_registration = -1 LIMIT " +
      search.limit +
      " OFFSET " +
      search.offset;
    console.log("test4");
  } else if (search.status == "ARCHIVE" && search.q) {
    searchReqest =
      "SELECT * FROM  events e WHERE e.name LIKE '%" +
      search.q +
      "%' AND e.close_registration = -1  LIMIT " +
      search.limit +
      " OFFSET " +
      search.offset;
  } else if (search.q && search.status == "OPEN") {
    searchReqest =
      "SELECT * FROM  events e WHERE e.name LIKE '%" +
      search.q +
      "%' AND e.close_registration != -1  LIMIT " +
      search.limit +
      " OFFSET " +
      search.offset;
  } else if (search.status == "OPEN" && !search.q) {
    //
    searchReqest =
      "SELECT * FROM  events e WHERE e.close_registration != -1 LIMIT " +
      search.limit +
      " OFFSET " +
      search.offset;
  } else if (search.q && !search.search) {
    // serches the users input
    searchReqest =
      "SELECT * FROM  events e WHERE e.name LIKE '%" +
      search.q +
      "%' LIMIT " +
      search.limit +
      " OFFSET " +
      search.offset;
  }

  console.log(searchReqest);

  db.all(searchReqest, (err, row) => {
    // console.log(row);
    if (err) return done(err);
    if (row != null) {
      let event_list = [];
      for (i = 0; i < row.length; i++) {
        event_list.push(row[i]);
      }
      return done(err, event_list);
    }
  });
};

module.exports = {
  createEvents: createEvents,
  get_event: get_event,
  updateEvent: updateEvent,
  register: register,
  deleteEvent: deleteEvent,
  is_attending: is_attending,
  searchEvents: searchEvents,
};
