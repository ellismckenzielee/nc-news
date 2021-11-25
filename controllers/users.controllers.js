const { selectUsers, selectUserByUsername, selectArticlesByUsername, insertUser } = require("../models/users.models");

exports.getUsers = (req, res, next) => {
  console.log(req.params);
  const { sort_by, order } = req.query;
  console.log(sort_by, order);
  selectUsers(sort_by, order)
    .then((users) => res.status(200).send({ users }))
    .catch(next);
};

exports.getUserByUsername = (req, res, next) => {
  const { username } = req.params;
  selectUserByUsername(username)
    .then((user) => {
      res.status(200).send({ user });
    })
    .catch(next);
};

exports.getArticlesByUsername = (req, res, next) => {
  console.log("in get articles by username");
  const { username } = req.params;
  selectArticlesByUsername(username)
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch(next);
};

exports.postUser = (req, res, next) => {
  console.log("in post user controller");
  const { username, name, avatar_url } = req.body;
  console.log(username, name, avatar_url);
  insertUser(username, name, avatar_url)
    .then((user) => {
      res.status(201).send({ user });
    })
    .catch(next);
};
