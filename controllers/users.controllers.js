const { selectUsers } = require("../models/users.models");

exports.getUsers = (req, res, next) => {
  console.log("inside getUsers controller");
  selectUsers().then((users) => res.status(200).send({ users }));
};
