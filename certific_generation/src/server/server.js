import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import multer from "multer";
import path from "path";

const app = express();

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./images");
  },
  filename: (req, file, cb) => {
    console.log(file);
    cb(null, Date.now() + "--" + path.extname(file.originalname));
  },
});

const upload = multer({ storage: fileStorage });

app.post("/upload", upload.single("image"), (req, res) => {
  console.log(req.file);
  res.send("Image Uploaded");
});

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

const templateSchema = new mongoose.Schema({
  title_color: String,
  title_top: Number,
  title_left: Number,
  duration_color: String,
  duration_top: Number,
  duration_left: Number,
  teacherSurname_color: String,
  teacherSurname_top: Number,
  teacherSurname_left: Number,
  studentName_color: String,
  studentName_top: Number,
  studentName_left: Number,
  dateOfGiving_color: String,
  dateOfGiving_top: Number,
  dateOfGiving_left: Number,
});

const User = mongoose.model("users", userSchema);
const Certificate = mongoose.model("certificates", certificateSchema);
const Template = mongoose.model("certificate_templates", templateSchema);

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
    const newCertificate = new Certificate({
      title,
      duration,
      teacherSurname,
    });
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

app.post("/saveTemplateData", async (req, res) => {
  const {
    title_color,
    title_top,
    title_left,
    duration_color,
    duration_top,
    duration_left,
    teacherSurname_color,
    teacherSurname_top,
    teacherSurname_left,
    studentName_color,
    studentName_top,
    studentName_left,
    dateOfGiving_color,
    dateOfGiving_top,
    dateOfGiving_left,
  } = req.body;
  try {
    const newTemplate = new Template({
      title_color,
      title_top,
      title_left,
      duration_color,
      duration_top,
      duration_left,
      teacherSurname_color,
      teacherSurname_top,
      teacherSurname_left,
      studentName_color,
      studentName_top,
      studentName_left,
      dateOfGiving_color,
      dateOfGiving_top,
      dateOfGiving_left,
    });
    console.log(newTemplate);
    await newTemplate.save();
    res.status(200).json({ message: "Дані успішно збережено" });
  } catch (error) {
    console.error("Помилка збереження даних:", error);
    res.status(500).json({ error: "Помилка сервера" });
  }
});

app.listen(3001, () => {
  console.log("Server is running");
});
