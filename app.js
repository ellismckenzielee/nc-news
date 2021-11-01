const express = require("express");
const app = express();
const apiRouter = require("./routes/api-router");

app.use("/api", apiRouter);

app.use("/*", (req, res, next) => {
  res.status(404).send({ msg: "Invalid URL" });
});

module.exports = app;
