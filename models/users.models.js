const db = require("../db/connection");

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
  console.log("in select articles by username");
  return db
    .query("SELECT articles.title  FROM users LEFT JOIN articles ON  users.username = articles.author WHERE author=$1;", [username])
    .then(({ rows }) => {
      return rows;
    })
    .catch(console.log);
};
