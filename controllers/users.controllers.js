const { selectUsers, selectUserByUsername } = require("../models/users.models");

exports.getUsers = (req, res, next) => {
  console.log("inside getUsers controller");
  selectUsers().then((users) => res.status(200).send({ users }));
};

exports.getUserByUsername = (req, res, next) => {
  console.log("inside getUserByUsername controller");
  const { username } = req.params;
  selectUserByUsername(username).then((user) => {
    res.status(200).send({ user });
  });
};
