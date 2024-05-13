import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import multer from "multer";
import path from "path";
import fs from "fs";
import nodeHtmlToImage from "node-html-to-image";

const app = express();

app.use(cors());

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
  res.json({
    imagePath: req.file.path,
  });
});

const imagesFolderPath = path.resolve("images");
app.use("/images", express.static(imagesFolderPath));

app.get("/images", (req, res) => {
  const directoryPath = imagesFolderPath;
  fs.readdir(directoryPath, (err, files) => {
    if (err) {
      return console.log("Unable to scan directory: " + err);
    }
    const imagePaths = files.map((file) => `/images/${file}`);
    res.json(imagePaths);
  });
});

let students = [];
let certificates = [];

app.use(express.json());

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
  selectedStudents: [{ type: mongoose.Schema.Types.ObjectId, ref: "users" }],
  selectedTemplate: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "certificate_templates",
  },
  certData: Object,
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
  imagePath: String,
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
    imagePath,
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
      imagePath,
    });
    console.log(newTemplate);
    await newTemplate.save();
    res.status(200).json({ message: "Дані успішно збережено", imagePath });
  } catch (error) {
    console.error("Помилка збереження даних:", error);
    res.status(500).json({ error: "Помилка сервера" });
  }
});

app.get("/getCertificateImageData", async (req, res) => {
  try {
    const imagePath = req.query.imagePath;
    const template = await Template.findOne({ imagePath: imagePath });
    if (!template) {
      return res.status(404).json({ error: "Template not found" });
    }
    res.status(200).json({ templateId: template._id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/generateCertificate", async (req, res) => {
  const { CertData } = req.body;

  try {
    const selectedStudentIds = req.body.selectedStudentIds;

    const selectedStudents = await User.find({
      _id: { $in: selectedStudentIds },
    });
    const selectedStudentNames = selectedStudents.map(
      (student) => student.name
    );

    const templateId = req.body.selectedTemplateId;
    console.log(templateId);
    const template = await Template.findById(templateId);
    console.log(template);

    const newCertificate = {
      selectedStudents: selectedStudentNames,
      selectedTemplate: template,
      title: CertData.title,
      duration: CertData.duration,
      teacherSurname: CertData.teacherSurname,
    };

    const image = fs.readFileSync(template.imagePath);
    const base64Image = new Buffer.from(image).toString("base64");
    const dataURI = "data:image/jpeg;base64," + base64Image;

    nodeHtmlToImage({
      output: "./image.png",
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Certificate Template</title>
            <style>
                body {
                  font-family: Arial, sans-serif;
                  text-align: center;
                }
                .certificate {
                  width: 900px;
                  height: 400px;
                  margin-top: 50px;
                }
                .certificate .title {
                    position: absolute;                  
                    font-size: 24px;
                    margin-top: 20px;
                    color: ${template.title_color};
                    top: ${template.title_top};
                    left: ${template.title_left};
                }
                .certificate .duration {
                    position: absolute; 
                    font-size: 18px;
                    margin-top: 10px;
                    color: ${template.duration_color}
                    top: ${template.duration_top};
                    left: ${template.duration_left};
                }
                .certificate .teacher {
                    position: absolute; 
                    font-size: 18px;
                    margin-top: 10px;
                    color: ${template.teacherSurname_color}
                    top: ${template.teacherSurname_top};
                    left: ${template.teacherSurname_left};
                }
                .certificate .student {
                  position: absolute; 
                  font-size: 18px;
                  margin-top: 10px;
                  color: ${template.studentName_color}
                  top: ${template.studentName_top};
                  left: ${template.studentName_left};
              }
            </style>
        </head>
        <body>
            <div class="certificate">
              <img src="{{imageSource}}"  alt="Certificate Template">
              
            </div>
        </body>
        </html>
    `,
      content: { imageSource: dataURI },
    }).then(() => console.log("The image was created successfully!"));

    //await newCertificate.save();
    console.log(newCertificate);
    console.log("Certificate generated successfully");
  } catch (error) {
    console.error("Error generating certificate:", error);
  }
});

app.listen(3001, () => {
  console.log("Server is running");
});
