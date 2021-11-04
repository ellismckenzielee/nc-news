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
      if (rows.length > 0) return rows[0];
      else return Promise.reject({ status: 404, msg: "user not found" });
    });
};
