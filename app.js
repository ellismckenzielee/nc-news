const express = require("express");
const app = express();
const apiRouter = require("./routes/api-router");
const {
  handleCustomErrors,
  handlePSQLErrors,
  handle500,
  handle404,
} = require("./errors/error-handling.errors");

//setup middleware
app.use(express.json());

//setup routes
app.use("/api", apiRouter);
app.use("/*", handle404);

//setup error handlers
app.use(handlePSQLErrors);
app.use(handleCustomErrors);
app.use(handle500);

module.exports = app;
