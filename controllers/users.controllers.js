const { selectUsers, selectUserByUsername, selectArticlesByUsername, insertUser, removeUserById } = require("../models/users.models");

exports.getUsers = (req, res, next) => {
  const { sort_by, order, p } = req.query;
  selectUsers(sort_by, order, p)
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
  const { username } = req.params;
  selectArticlesByUsername(username)
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch(next);
};

exports.postUser = (req, res, next) => {
  const { username, name, avatar_url } = req.body;
  insertUser(username, name, avatar_url)
    .then((user) => {
      res.status(201).send({ user });
    })
    .catch(next);
};

exports.deleteUserById = (req, res, next) => {
  const { username } = req.params;
  removeUserById(username)
    .then(() => {
      res.sendStatus(204);
    })
    .catch(next);
};
