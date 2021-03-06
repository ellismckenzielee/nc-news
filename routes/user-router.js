const userRouter = require("express").Router();
const { getUsers, getUserByUsername, getArticlesByUsername, postUser, deleteUserById } = require("../controllers/users.controllers");
const { invalidMethod } = require("../controllers/errors.controllers");

userRouter.route("/").get(getUsers).post(postUser).all(invalidMethod);
userRouter.route("/:username").get(getUserByUsername).delete(deleteUserById);
userRouter.route("/:username/articles").get(getArticlesByUsername);
module.exports = userRouter;
