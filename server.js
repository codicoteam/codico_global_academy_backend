const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");

const payCourse = require("./routers/pay_course_router");
const emailRouter = require("./routers/email_router");

const dbUrl =
  "mongodb+srv://codicoglobal:uaR3RoyD0OkPuo2w@codicoglobalacademy.e2kau.mongodb.net/?retryWrites=true&w=majority&appName=CodicoGlobalAcademy";

mongoose
  .connect(dbUrl)
  .then(() => console.log("Database connected successfully"))
  .catch((err) => console.error("Error connecting to the database:", err));
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());
// Register main app routes
app.use("/api/v1/pay_course", payCourse);
app.use("/api/v1/email", emailRouter); // Email routes

const Port = 4040;
app.listen(Port, () => {
  console.log("The server is running at port:", Port);
});