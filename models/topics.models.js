const db = require("../db/connection");

exports.selectTopics = () => {
  console.log("in select topics model");
  return db.query("SELECT * FROM topics;").then(({ rows }) => {
    return rows;
  });
};
