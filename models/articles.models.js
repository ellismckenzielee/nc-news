const db = require("../db/connection");

exports.selectArticleById = (article_id) => {
  console.log(article_id);
  return db
    .query("SELECT * FROM articles WHERE article_id = $1", [article_id])
    .then(({ rows }) => {
      console.log("in rows", rows);
      return rows[0];
    });
};

exports.updateArticleById = (article_id, votesInc) => {
  console.log("in deleteArticleById");
  return db
    .query(
      "UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *;",
      [votesInc, article_id]
    )
    .then(({ rows }) => {
      console.log(rows);
      return rows[0];
    });
};
