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
      const createUsersQuery = `CREATE TABLE users (
        user_id SERIAL PRIMARY KEY,
        username VARCHAR(25) NOT NULL,
        name VARCHAR NOT NULL,
        avatar_url VARCHAR
        );`;
      return db.query(createUsersQuery);
    })
    .then(() => {
      const createTopicsQuery = `CREATE TABLE topics (
        topic_id SERIAL PRIMARY KEY,
        slug VARCHAR(20) NOT NULL,
        description TEXT NOT NULL
        );`;
      return db.query(createTopicsQuery);
    })
    .catch((err) => console.log(err));
};

module.exports = seed;
