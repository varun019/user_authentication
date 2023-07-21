const mongoose = require("mongoose");
const express = require("express");
const app = express();
const router = express.Router();
const authroutes = require("./routes/auth");
const refreshTokenRoutes = require("./routes/refreshToken")
const {config} = require("dotenv");
// const auth = require("./middleware/auth");

mongoose.connect("mongodb://localhost:27017/User-Auth", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

config();
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("connected to the database!!");
})

app.use(express.json());

app.use('/', router);
app.use('/api', authroutes);
app.use('/api/refreshtoken' , refreshTokenRoutes);

router.get("/", (req, resp) => {
  resp.send('hello world')
})

const PORT = 8080;
app.listen(PORT, () => {
  console.log("running on the port 8080!");
});

