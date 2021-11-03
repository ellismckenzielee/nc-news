const db = require("../db/connection");

exports.selectUsers = () => {
  console.log("in selectUsers model");
  return db.query("SELECT username FROM users;").then(({ rows }) => {
    return rows;
  });
};
