const db = require("../connection");
const format = require("pg-format");
const {
  convertObjectsToArrays,
  createReferenceObject,
  updateObjectsArray,
} = require("../utils/utils");

const seed_using_ids = ({ articleData, commentData, topicData, userData }) => {
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
        topic_id INT REFERENCES topics(topic_id) NOT NULL,
        body TEXT NOT NULL,
        author_id INT REFERENCES users(user_id) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        votes INT DEFAULT 0
      );`;
      return db.query(createArticlesQuery);
    })
    .then(() => {
      const createCommentsQuery = `CREATE TABLE comments (
        comment_id SERIAL PRIMARY KEY,
        body TEXT NOT NULL,
        votes INT DEFAULT 0, 
        author_id INT REFERENCES users(user_id) NOT NULL,
        article_id INT REFERENCES articles(article_id) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );`;
      return db.query(createCommentsQuery);
    })
    .then(() => {
      const keyOrder = ["username", "name", "avatar_url"];
      const userDataArray = convertObjectsToArrays(userData, keyOrder);
      const insertUsersQuery = format(
        `INSERT INTO users (username, name, avatar_url) VALUES %L RETURNING *;`,
        userDataArray
      );
      return db.query(insertUsersQuery);
    })
    .then(({ rows: updatedUserData }) => {
      const keyOrder = ["description", "slug"];
      const topicsDataArray = convertObjectsToArrays(topicData, keyOrder);
      const insertTopicsQuery = format(
        `INSERT INTO topics (description, slug) VALUES %L RETURNING *;`,
        topicsDataArray
      );
      return Promise.all([updatedUserData, db.query(insertTopicsQuery)]);
    })
    .then(([updatedUserData, { rows: updatedTopicData }]) => {
      const userUserIdReferenceObject = createReferenceObject(
        updatedUserData,
        "username",
        "user_id"
      );
      const topicTopicIdReferenceObject = createReferenceObject(
        updatedTopicData,
        "slug",
        "topic_id"
      );
      const articleDataUpdatedUsers = updateObjectsArray(
        articleData,
        userUserIdReferenceObject,
        "author",
        "author_id"
      );
      const articleDataUpdatedTopics = updateObjectsArray(
        articleDataUpdatedUsers,
        topicTopicIdReferenceObject,
        "topic",
        "topic_id"
      );
      const articleDataArray = convertObjectsToArrays(
        articleDataUpdatedTopics,
        ["title", "topic_id", "author_id", "body", "created_at", "votes"]
      );
      const insertArticlesQuery = format(
        `INSERT INTO articles (title, topic_id, author_id, body, created_at, votes) VALUES %L`,
        articleDataArray
      );

      return Promise.all([
        userUserIdReferenceObject,
        db.query(insertArticlesQuery),
      ]);
    })
    .then(([userUserIdReferenceObject, ...rest]) => {
      const commentDataUpdatedUsers = updateObjectsArray(
        commentData,
        userUserIdReferenceObject,
        "author",
        "author_id"
      );
      const commentDataArray = convertObjectsToArrays(commentDataUpdatedUsers, [
        "body",
        "votes",
        "author_id",
        "article_id",
        "created_at",
      ]);
      const insertCommentsQuery = format(
        `INSERT INTO comments (body, votes, author_id, article_id, created_at) VALUES %L;`,
        commentDataArray
      );
      return db.query(insertCommentsQuery);
    });
};

module.exports = seed_using_ids;
