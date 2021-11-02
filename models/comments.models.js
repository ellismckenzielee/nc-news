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
      console.log(rows);
      return rows;
    });
};
