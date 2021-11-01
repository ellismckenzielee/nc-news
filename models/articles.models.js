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
