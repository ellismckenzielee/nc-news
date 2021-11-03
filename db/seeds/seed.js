const db = require("../connection");
const format = require("pg-format");
const { convertObjectsToArrays } = require("../../utils/utils");

const seed = (data) => {
  const { articleData, commentData, topicData, userData } = data;
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
        username VARCHAR PRIMARY KEY,
        name VARCHAR NOT NULL,
        avatar_url VARCHAR DEFAULT 'default_avatar_url'
        );`;
      return db.query(createUsersQuery);
    })
    .then(() => {
      const createTopicsQuery = `CREATE TABLE topics (
        slug VARCHAR PRIMARY KEY,
        description TEXT NOT NULL
        );`;
      return db.query(createTopicsQuery);
    })
    .then(() => {
      const createArticlesQuery = `CREATE TABLE articles (
        article_id SERIAL PRIMARY KEY,
        title VARCHAR NOT NULL,
        topic VARCHAR REFERENCES topics(slug) NOT NULL,
        body TEXT NOT NULL,
        author VARCHAR REFERENCES users(username) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        votes INT NOT NULL DEFAULT 0
      );`;
      return db.query(createArticlesQuery);
    })
    .then(() => {
      const createCommentsQuery = `CREATE TABLE comments (
        comment_id SERIAL PRIMARY KEY,
        body TEXT NOT NULL,
        votes INT DEFAULT 0, 
        author VARCHAR REFERENCES users(username) NOT NULL,
        article_id INT REFERENCES articles(article_id) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );`;
      return db.query(createCommentsQuery);
    })
    .then(() => {
      const userDataArray = convertObjectsToArrays(userData, [
        "username",
        "name",
        "avatar_url",
      ]);
      const insertUsersQuery = format(
        `INSERT INTO users (username, name, avatar_url) VALUES %L`,
        userDataArray
      );
      return db.query(insertUsersQuery);
    })
    .then(() => {
      const topicDataArray = convertObjectsToArrays(topicData, [
        "slug",
        "description",
      ]);
      const insertTopicsQuery = format(
        `INSERT INTO topics (slug, description) VALUES %L`,
        topicDataArray
      );
      return db.query(insertTopicsQuery);
    })
    .then(() => {
      const articleDataArray = convertObjectsToArrays(articleData, [
        "title",
        "topic",
        "author",
        "body",
        "created_at",
        "votes",
      ]);
      const insertArticlesQuery = format(
        `INSERT INTO articles (title, topic, author, body, created_at, votes) VALUES %L`,
        articleDataArray
      );
      return db.query(insertArticlesQuery);
    })
    .then(() => {
      const commentDataArray = convertObjectsToArrays(commentData, [
        "body",
        "votes",
        "author",
        "article_id",
        "created_at",
      ]);
      const insertCommentsQuery = format(
        `INSERT INTO comments (body, votes, author, article_id, created_at) VALUES %L`,
        commentDataArray
      );
      return db.query(insertCommentsQuery);
    })
    .catch((err) => console.log(err));
};

module.exports = seed;
