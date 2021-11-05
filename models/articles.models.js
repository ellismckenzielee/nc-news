const db = require("../db/connection");
const {
  handleSortQuery,
  handleOrderQuery,
  assembleSelectArticlesQuery,
  handleLimitQuery,
  handlePaginationOffset,
} = require("../utils/utils");

exports.selectArticleById = (article_id) => {
  return db
    .query(
      "SELECT articles.article_id, articles.title, articles.topic, articles.author, articles.body, articles.created_at, articles.votes, COUNT(comments.comment_id)::integer AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id WHERE articles.article_id = $1 GROUP BY articles.article_id",
      [article_id]
    )
    .then(({ rows }) => {
      if (rows.length > 0) {
        return rows[0];
      } else {
        return Promise.reject({ status: 404, msg: "article not found" });
      }
    });
};

exports.updateArticleById = (article_id, inc_votes) => {
  if (isNaN(inc_votes)) {
    return Promise.reject({ status: 400, msg: "400: bad request" });
  } else {
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
  }
};

exports.selectArticles = ({ sort_by, order, topicFilter, limit, p }) => {
  sort_by = handleSortQuery(sort_by);
  order = handleOrderQuery(order);
  limit = handleLimitQuery(limit);
  p = handlePaginationOffset(p);
  if (!(sort_by && order && limit && p !== false)) {
    return Promise.reject({ status: 400, msg: "invalid query" });
  } else {
    const [queryString, queryParams] = assembleSelectArticlesQuery(
      sort_by,
      order,
      topicFilter,
      limit,
      p
    );
    return db
      .query(queryString, queryParams)
      .then(({ rows }) => {
        return Promise.all([rows, db.query("SELECT slug FROM topics;")]);
      })
      .then(([rows, { rows: topicObjects }]) => {
        if (rows.length > 0) return rows;
        const topics = topicObjects.map((topic) => topic.slug);
        if (!topics.includes(topicFilter) && topicFilter) {
          return Promise.reject({ status: 404, msg: "topic not found" });
        } else {
          return rows;
        }
      });
  }
};

exports.selectArticleComments = (article_id) => {
  return db
    .query(
      "SELECT comment_id, votes, created_at, author, body FROM comments WHERE article_id=$1",
      [article_id]
    )
    .then(({ rows }) => {
      return Promise.all([
        rows,
        db.query("SELECT * FROM articles WHERE article_id = $1;", [article_id]),
      ]);
    })
    .then(([comments, { rows: articles }]) => {
      if (comments.length) return comments;
      else {
        if (articles.length) {
          return comments;
        } else {
          return Promise.reject({ status: 404, msg: "article not found" });
        }
      }
    });
};

exports.insertArticleComment = (username, body, article_id) => {
  if (!(username && body && article_id) || isNaN(article_id)) {
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

exports.removeArticleById = (article_id) => {
  return db
    .query("DELETE FROM articles WHERE article_id = $1;", [article_id])
    .then(({ rowCount }) => {
      return rowCount
        ? rowCount
        : Promise.reject({ status: 404, msg: "article not found" });
    });
};

exports.insertArticle = (author, title, body, topic) => {
  console.log("in insertArticle model");
  console.log(author, title, body, topic);
  if (!(author && title && topic)) {
    return Promise.reject({ status: 400, msg: "400: bad request" });
  } else {
    return db
      .query(
        "INSERT INTO articles (author, title, body, topic) VALUES ( $1, $2, $3, $4) RETURNING *",
        [author, title, body, topic]
      )
      .then(({ rows }) => {
        return rows[0];
      });
  }
};
