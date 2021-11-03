const db = require("../db/connection");

exports.selectComments = (article_id) => {
  console.log("inside selectComments model");
  console.log(article_id);
  return db
    .query(
      "SELECT comment_id, votes, created_at, author, body FROM comments WHERE article_id=$1",
      [article_id]
    )
    .then(({ rows }) => {
      if (rows.length > 0) return rows;
      return Promise.reject({ status: 404, msg: "article not found" });
    });
};

exports.insertComment = (username, body, article_id) => {
  console.log("in insertComment model");
  return db
    .query(
      "INSERT INTO comments (author, body, article_id) VALUES ($1, $2, $3) RETURNING *;",
      [username, body, article_id]
    )
    .then(({ rows }) => {
      return rows[0];
    })
    .catch(console.log);
};
