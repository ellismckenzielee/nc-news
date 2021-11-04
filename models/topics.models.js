const db = require("../db/connection");

exports.selectTopics = () => {
  return db.query("SELECT * FROM topics;").then(({ rows }) => {
    return rows;
  });
};

exports.insertTopic = (slug, description) => {
  console.log("in insertTopic model");
  console.log(slug, description);
  return db
    .query(
      "INSERT INTO topics (slug, description) VALUES ($1, $2) RETURNING *;",
      [slug, description]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};
