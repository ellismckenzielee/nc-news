const db = require("../db/connection");

exports.selectArticleById = (article_id) => {
  console.log("in selectArticleById model");
  console.log(article_id);
  return db
    .query("SELECT * FROM articles WHERE article_id = $1", [article_id])
    .then(({ rows }) => {
      if (rows.length > 0) {
        return rows[0];
      } else {
        return Promise.reject({ status: 404, msg: "article not found" });
      }
    });
};

exports.updateArticleById = (article_id, votesInc) => {
  console.log("in updateArticleById model");
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
};

exports.selectArticles = () => {
  console.log("in selectArticlesController");
  return db
    .query(
      "SELECT articles.author, title, articles.article_id, topic, articles.created_at, articles.votes, COUNT(comments.comment_id )::integer AS comment_count FROM articles  LEFT JOIN comments ON articles.article_id = comments.article_id  GROUP BY articles.article_id ORDER BY articles.created_at;"
    )
    .then(({ rows }) => rows);
};
