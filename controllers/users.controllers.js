const { selectUsers, selectUserByUsername, selectArticlesByUsername, insertUser } = require("../models/users.models");

exports.getUsers = (req, res, next) => {
  selectUsers().then((users) => res.status(200).send({ users }));
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
  const { sort_by, order } = req.params;
  console.log(username, name, avatar_url, sort_by, order);
  insertUser(username, name, avatar_url).then((user) => {
    res.status(201).send({ user });
  });
};
