const e = require("express");
const db = require("../db/connection");
const {
  handleSortQuery,
  handleOrderQuery,
  assembleSelectArticlesQuery,
} = require("../utils/utils");

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

exports.updateArticleById = (article_id, inc_votes) => {
  console.log("in updateArticleById model");
  return db
    .query(
      "UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *;",
      [inc_votes, article_id]
    )
    .then(({ rows }) => {
      if (rows.length > 0) {
        return rows[0];
      } else {
        return Promise.reject({ status: 404, msg: "article not found" });
      }
    });
};

exports.selectArticles = (sort_by, order, topicFilter) => {
  console.log("in selectArticlesController");
  sort_by = handleSortQuery(sort_by);
  order = handleOrderQuery(order);

  if (!(sort_by && order)) {
    return Promise.reject({ status: 400, msg: "invalid query" });
  } else {
    const [queryString, queryParams] = assembleSelectArticlesQuery(
      sort_by,
      order,
      topicFilter
    );
    return db
      .query(queryString, queryParams)
      .then(({ rows }) => {
        return Promise.all([rows, db.query("SELECT slug FROM topics;")]);
      })
      .then(([rows, { rows: topicObjects }]) => {
        if (rows.length > 0) return rows;
        const topics = topicObjects.map((topic) => topic.slug);
        if (!topics.includes(topicFilter)) {
          return Promise.reject({ status: 404, msg: "topic not found" });
        } else {
          return rows;
        }
      });
  }
};

exports.selectArticleComments = (article_id) => {
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

exports.insertArticleComment = (username, body, article_id) => {
  console.log("in insertComment model");
  if (!(username && body && article_id)) {
    return Promise.reject({ status: 400, msg: "400: bad request" });
  } else {
    return db
      .query(
        "INSERT INTO comments (author, body, article_id) VALUES ($1, $2, $3) RETURNING *;",
        [username, body, article_id]
      )
      .then(({ rows }) => {
        return rows[0];
      });
  }
};
