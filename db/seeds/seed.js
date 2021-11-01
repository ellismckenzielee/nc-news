const db = require("../connection");
const format = require("pg-format");

const seed = ({ articleData, commentData, topicData, userData }) => {
  return db
    .query("DROP TABLE IF EXISTS comments")
    .then(() => {
      return db.query("DROP TABLE IF EXISTS articles");
    })
    .then(() => {
      const removeTopics = db.query("DROP TABLE IF EXISTS topics");
      const removeUsers = db.query("DROP TABLE IF EXISTS users");
      return Promise.all([removeTopics, removeUsers]);
    })
    .then(() => {
      console.log("Tables successfully removed!");
    })
    .catch((err) => console.log(err));
};

module.exports = seed;
