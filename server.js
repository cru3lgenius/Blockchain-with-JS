const express = require("express");
const app = express();
const publicPath = __dirname + "/public";

app.use(express.static(publicPath));

app.listen(3000);
