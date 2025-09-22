const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const mainRouter = require("./routes/index");
const { login, createUser } = require("./controllers/users");
const auth = require("./middlewares/auth");
const { errors } = require("celebrate");
const errorHandler = require("./middlewares/error-handler");

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

app.post("/signin", login);
app.post("/signup", createUser);
app.use(auth);

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.use("/", mainRouter);
app.use(errors());
app.use(errorHandler);

if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
  });
}

module.exports = app;
