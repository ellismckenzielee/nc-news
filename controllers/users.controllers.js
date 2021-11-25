const { selectUsers, selectUserByUsername, selectArticlesByUsername } = require("../models/users.models");

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
