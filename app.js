const express = require("express");
const app = express();
const apiRouter = require("./routes/api-router");
const {
  handleCustomErrors,
  handlePSQLErrors,
} = require("./errors/error-handling.errors");

app.use(express.json());
app.use("/api", apiRouter);

app.use(handleCustomErrors);
app.use(handlePSQLErrors);

app.use("/*", (req, res, next) => {
  res.status(404).send({ msg: "Invalid URL" });
});

app.use(handle500);

module.exports = app;
