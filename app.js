const express = require("express");
const app = express();
const cors = require("cors");
const apiRouter = require("./routes/api-router");
const { handleCustomErrors, handlePSQLErrors, handle500, handle404 } = require("./controllers/errors.controllers");

//setup middleware
app.use(cors());
app.use(express.json());

//setup routes
app.use("/api", apiRouter);
app.use("/*", handle404);

//setup error handlers
app.use(handlePSQLErrors);
app.use(handleCustomErrors);
app.use(handle500);

module.exports = app;
