const db = require("../db/connection");

exports.selectTopics = () => {
  console.log("in selectTopics model");
  return db.query("SELECT * FROM topics;").then(({ rows }) => {
    return rows;
  });
};
