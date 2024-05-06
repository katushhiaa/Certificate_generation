import express from "express";
import mongoose from "mongoose";
import cors from "cors";

const app = express();
let students = [];
let certificates = [];

app.use(express.json());
app.use(cors());

mongoose.connect("mongodb://localhost:27017/database");

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB");
});

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: String,
});

const certificateSchema = new mongoose.Schema({
  title: String,
  duration: String,
  teacherSurname: String,
});

const User = mongoose.model("User", userSchema);
const Certificate = mongoose.model("Certificate", certificateSchema);

app.post("/signup", async (req) => {
  const { name, email, password, role } = req.body;
  try {
    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      return console.log("Користувач з цією електронною адресою вже існує");
    }
    const newUser = new User({ name, email, password, role });
    console.log(newUser);
    await newUser.save();
    console.log("User registered successfully");
  } catch (error) {
    console.error(error);
  }
});

app.post("/login", async (req) => {
  const { name, password, role } = req.body;
  try {
    const user = await User.findOne({ name, password, role });
    if (user) {
      console.log("Вхід успішний", user);
    } else {
      console.log("Неправильні дані входу");
    }
  } catch (error) {
    console.error(error);
    return console.log("Помилка сервера");
  }
});

app.post("/certificateData", async (req) => {
  const { title, duration, teacherSurname } = req.body;
  try {
    const newCertificate = new Certificate({ title, duration, teacherSurname });
    console.log(newCertificate);
    await newCertificate.save();
    console.log("Дані успішно додано");
  } catch (error) {
    console.error(error);
    return console.log("Помилка сервера");
  }
});

app.get("/getCertData", async (req, res) => {
  try {
    certificates = await Certificate.find();
    res.status(200).json(certificates);
  } catch (error) {
    console.log(error);
  }
});

app.get("/students", async (req, res) => {
  try {
    students = await User.find({ role: "student" });
    console.log(students);
    res.status(200).json(students);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error" });
  }
});

app.listen(3001, () => {
  console.log("Server is running");
});
