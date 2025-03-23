const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
require("dotenv").config();

const { initFirebase } = require("./config/firebase");
const db = initFirebase();

global.db = db;

const app = express();

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

app.use("/api", require("./routes/api"));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ message: "Щось пішло не так!" });
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Сервер запущено на порту ${PORT}`);
});

module.exports = app;
