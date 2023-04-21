const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
require("./models/index");

const routes = require("./routes/index");

let app = express();
const port = process.env.PORT || 8080;

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(bodyParser.json());

app.use("/api", routes);

app.listen(port, () => {
  console.log(
    "Server is up and running at port : ",
    port,
    process.env.NODE_ENV ? process.env.NODE_ENV : ""
  );
});
