const db = require("../db/connection");

exports.selectArticleById = (article_id) => {
  console.log(article_id);
  return db
    .query("SELECT * FROM articles WHERE article_id = $1", [article_id])
    .then(({ rows }) => {
      console.log("in rows", rows);
      if (rows.length > 0) {
        return rows[0];
      } else {
        return Promise.reject({ status: 404, msg: "article not found" });
      }
    });
};

exports.updateArticleById = (article_id, votesInc) => {
  console.log("in deleteArticleById");
  if (typeof votesInc !== "number") {
    return Promise.reject({
      status: 400,
      msg: "bad request: invalid vote increment",
    });
  } else {
    return db
      .query(
        "UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *;",
        [votesInc, article_id]
      )
      .then(({ rows }) => {
        if (rows.length > 0) {
          return rows[0];
        } else {
          return Promise.reject({ status: 404, msg: "article not found" });
        }
      });
  }
};
