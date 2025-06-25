const express = require("express");
const app = express();
const router = require("./router/router");
require("./dbconfig/config");

app.use(express.json());
app.use("/", router);
app.use(express.urlencoded({ extended: false }));
app.listen(5000, () => {
  console.log("server run on port no 5000");
});
