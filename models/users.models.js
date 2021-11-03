const db = require("../db/connection");

exports.selectUsers = () => {
  console.log("in selectUsers model");
  return db.query("SELECT username FROM users;").then(({ rows }) => {
    return rows;
  });
};

exports.selectUserByUsername = (username) => {
  console.log("in selectUserByUsername model");
  return db
    .query("SELECT username, avatar_url, name FROM users WHERE username = $1", [
      username,
    ])
    .then(({ rows }) => {
      return rows[0];
    });
};
