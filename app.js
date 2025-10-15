require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { errors } = require("celebrate");
const mainRouter = require("./routes/index");
const { login, createUser } = require("./controllers/users");
const auth = require("./middlewares/auth");
const errorHandler = require("./middlewares/error-handler");
const { requestLogger, errorLogger } = require("./middlewares/logger");
const {
  validateAuthentication,
  validateUserBody,
} = require("./middlewares/validation");

const app = express();

const { PORT = 3001 } = process.env;

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    console.log("connected to DB");
  })
  .catch(console.error);

app.use(express.json());

app.use(cors({ origin: "*" }));

app.get("/crash-test", () => {
  setTimeout(() => {
    throw new Error("Server will crash now");
  }, 0);
});

app.use(requestLogger);

app.post("/signin", validateAuthentication, login);
app.post("/signup", validateUserBody, createUser);
app.use(auth);

app.get("/", (req, res) => {
  res.send("Hello, World!");
});
app.use("/", mainRouter);

app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
  });
}

module.exports = app;
