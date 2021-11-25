const userRouter = require("express").Router();
const { getUsers, getUserByUsername, getArticlesByUsername, postUser } = require("../controllers/users.controllers");
const { invalidMethod } = require("../controllers/errors.controllers");

userRouter.route("/").get(getUsers).post(postUser).all(invalidMethod);
userRouter.route("/:username").get(getUserByUsername);
userRouter.route("/:username/articles").get(getArticlesByUsername);
module.exports = userRouter;
