const db = require("../db/connection");
const articles = require("../db/data/test-data/articles");

exports.selectUsers = () => {
  return db.query("SELECT username FROM users;").then(({ rows }) => {
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
  console.log("in select articles by username", username);
  return db
    .query(
      "SELECT articles.article_id, articles.title, articles.topic, articles.body, articles.author, articles.created_at, articles.votes, COUNT(*)::int AS comment_count  FROM articles LEFT JOIN comments ON articles.article_id = comments.comment_id WHERE articles.author=$1 GROUP BY articles.article_id;",
      [username]
    )
    .then(({ rows }) => {
      if (rows.length > 0) return rows;
      else {
        console.log("THEN", username);
        return Promise.all([rows, db.query("SELECT * FROM users WHERE username=$1", [username])]).then(([articles, { rows }]) => {
          console.log("then block");
          console.log(articles, rows);
          if (rows.length === 0) return Promise.reject({ status: 404, msg: "user not found" });
          else return articles;
        });
      }
    });
};

exports.insertUser = (username, name, avatar_url) => {
  console.log("in insert usqer function");
  return db.query("INSERT INTO users VALUES ($1, $2, $3) RETURNING *;", [username, name, avatar_url]).then(({ rows }) => {
    console.log(rows);
    return rows[0];
  });
};
