const express = require("express");
const app = express();
const apiRouter = require("./routes/api-router");
const {
  handleCustomErrors,
  handlePSQLErrors,
  handle500,
  handle404,
} = require("./errors/error-handling.errors");

app.use(express.json());
app.use("/api", apiRouter);

app.use(handlePSQLErrors);
app.use(handleCustomErrors);

app.use("/*", handle404);

app.use(handle500);

module.exports = app;
