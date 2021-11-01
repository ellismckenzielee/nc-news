const db = require("../connection");
const format = require("pg-format");
const { convertObjectsToArrays } = require("../utils/utils");

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
        avatar_url VARCHAR DEFAULT 'default_avatar_url'
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
    .then(() => {
      const createArticlesQuery = `CREATE TABLE articles (
        article_id SERIAL PRIMARY KEY,
        title VARCHAR NOT NULL,
        topic INT REFERENCES topics(topic_id) NOT NULL,
        body TEXT NOT NULL,
        author_id INT REFERENCES users(user_id) NOT NULL,
        created_at DATE NOT NULL,
        votes INT DEFAULT 0
      );`;
      return db.query(createArticlesQuery);
    })
    .then(() => {
      const createCommentsQuery = `CREATE TABLE comments (
        comment_id SERIAL PRIMARY KEY,
        body VARCHAR NOT NULL,
        votes INT DEFAULT 0, 
        author_id INT REFERENCES users(user_id) NOT NULL,
        article_id INT REFERENCES articles(article_id) NOT NULL,
        created_at DATE NOT NULL
      );`;
      return db.query(createCommentsQuery);
    })
    .then(() => {
      const keyOrder = ["username", "name", "avatar_url"];

      const userDataArray = convertObjectsToArrays(userData, keyOrder);
      const insertUsersQuery = format(
        `INSERT INTO users (username, name, avatar_url) VALUES %L`,
        userDataArray
      );
      return db.query(insertUsersQuery);
    })
    .catch((err) => console.log(err));
};

module.exports = seed;
