const db = require("../db/connection");
const { assembleSelectUsersQuery, handleUserSortQuery, handleUserSortOrder, handleUserPagination } = require("../utils/utils");
exports.selectUsers = (sort_by, order, p) => {
  p = handleUserPagination(p);
  sort_by = handleUserSortQuery(sort_by);
  order = handleUserSortOrder(order);
  if (!(sort_by && order) || p === false) return Promise.reject({ status: 400, msg: "Invalid query" });
  const query = assembleSelectUsersQuery(sort_by, order, p);
  return db.query(query).then(({ rows }) => {
    return rows;
  });
};

exports.selectUserByUsername = (username) => {
  return db.query("SELECT username, avatar_url, name FROM users WHERE username = $1", [username]).then(({ rows }) => {
    if (rows.length > 0) return rows[0];
    else return Promise.reject({ status: 404, msg: "user not found" });
  });
};

exports.selectArticlesByUsername = (username) => {
  return db.query("SELECT articles.article_id, articles.title, articles.topic, articles.body, articles.author, articles.created_at, articles.votes, COUNT(*)::int AS comment_count  FROM articles LEFT JOIN comments ON articles.article_id = comments.comment_id WHERE articles.author=$1 GROUP BY articles.article_id;", [username]).then(({ rows }) => {
    if (rows.length > 0) return rows;
    else {
      return Promise.all([rows, db.query("SELECT * FROM users WHERE username=$1", [username])]).then(([articles, { rows }]) => {
        if (rows.length === 0) return Promise.reject({ status: 404, msg: "user not found" });
        else return articles;
      });
    }
  });
};

exports.insertUser = (username, name, avatar_url) => {
  return db.query("INSERT INTO users VALUES ($1, $2, $3) RETURNING *;", [username, name, avatar_url]).then(({ rows }) => {
    return rows[0];
  });
};

exports.removeUserById = (username) => {
  return db.query("DELETE FROM users WHERE username=$1", [username]).then(({ rowCount }) => {
    return rowCount !== 0 ? rowCount : Promise.reject({ status: 404, msg: "user not found" });
  });
};
