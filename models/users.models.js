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
  return db.query("SELECT articles.title  FROM users LEFT JOIN articles ON  users.username = articles.author WHERE author=$1;", [username]).then(({ rows }) => {
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
