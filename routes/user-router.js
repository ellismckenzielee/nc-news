const userRouter = require("express").Router();
const { getUsers } = require("../controllers/users.controllers");
const { invalidMethod } = require("../controllers/errors.controllers");
userRouter.route("/").get(getUsers).all(invalidMethod);

module.exports = userRouter;
