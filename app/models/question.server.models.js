const db = require("../../database");

const createQuestion = (questions, id, event_id, done) => {
  console.log("do we get here")
  const sql =
    "INSERT INTO questions (question, asked_by, event_id, votes) VALUES (?,?,?,0)";
  console.log("event_id " + event_id);
  let values = [questions.question, id, event_id];
  db.run(sql, values, function (err) {
    if (err) return done(err);
    console.log(err)

    return done(err, {
      question_id: this.lastID,
    });
  });
};

const deleteQuestion = (question_id, done) => {
  const sql = "DELETE FROM questions WHERE question_id=?";
  db.run(sql, [question_id], (err) => {
    if (err) return done(err);
    return done(err, "Question deleted");
  });
};

const get_Question = (question_id, done) => {
  let query3_get_qestion = `SELECT * 
    FROM questions q , events e , users u 
    WHERE q.question_id=?
    AND q.event_id = e.event_id
    and q.asked_by = u.user_id`;

  db.get(query3_get_qestion, [question_id], (err, row) => {
    if (err) return done(err);
    console.log("get_qestion");
    if (!row) return done(err);
    if (row != null) {
      let qestions_to_return = {
        question_id: row.question_id,
        question: row.question,
        votes: row.votes,
        event_id: row.event_id,
        asked_by: {
          user_id: row.user_id,
          first_name: row.first_name,
        },
      };
      return done(err, qestions_to_return);
    }
  });
};

const upVoteQuestion = (question_id, id, done) => {
  const insert = `INSERT INTO votes (question_id, voter_id) VALUES (?,?)`;
  db.run(insert, [question_id, id], (err) => {
    if (err) return done(err);
    const sql =
      "UPDATE questions SET votes = COALESCE (votes,0) +1 WHERE question_id=? ";
    db.run(sql, [question_id], (err) => {
      if (err) return done(err);
      return done(err);
    });
  });
};

const downVoteQuestion = (question_id, id, done) => {
  const insert = `INSERT INTO votes (question_id, voter_id) VALUES (?,?)`;
  db.run(insert, [question_id, id], (err) => {
    if (err) return done(err);
    const sql =
      "UPDATE questions SET votes = COALESCE (votes,0) -1 WHERE question_id=?";
    db.run(sql, [question_id], (err) => {
      if (err) return done(err);
      return done(err);
    });
  });
};

module.exports = {
  createQuestion: createQuestion,
  deleteQuestion: deleteQuestion,
  get_Question: get_Question,
  upVoteQuestion: upVoteQuestion,
  downVoteQuestion: downVoteQuestion,
  
};
