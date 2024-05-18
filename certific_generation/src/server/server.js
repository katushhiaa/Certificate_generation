import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import multer from "multer";
import path from "path";
import fs from "fs";
import nodeHtmlToImage from "node-html-to-image";
import PDFDocument from "pdfkit";
import { MongoClient, ServerApiVersion } from "mongodb";

const app = express();

app.use(cors());

mongoose.connect(
  "mongodb+srv://kanurevamail:0x02G24YUd6AFGbe@dimplom-cluster.yc8oa4y.mongodb.net/?retryWrites=true&w=majority&appName=Dimplom-cluster"
);

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
  certData: Object,
  image: String,
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
  templateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "certificate_templates",
  },
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

const sertificatesFolderPath = path.resolve("sertificates");
app.use("/sertificates", express.static(sertificatesFolderPath));

app.get("/sertificates", (req, res) => {
  const directoryPath = sertificatesFolderPath;
  fs.readdir(directoryPath, (err, files) => {
    if (err) {
      return console.log("Unable to scan directory: " + err);
    }
    const imagePaths = files.map((file) => `/sertificates/${file}`);
    res.json(imagePaths);
  });
});

let students = [];
let certificates = [];

app.use(express.json());

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

app.post("/login", async (req, res) => {
  const { name, password, role } = req.body;
  try {
    const user = await User.findOne({ name, password, role });
    if (user) {
      console.log("Вхід успішний", user);
    } else {
      console.log("Неправильні дані входу");
    }
    if (user.role === "student") {
      res.status(200).json({ userId: user._id });
    }
  } catch (error) {
    console.error(error);
    return console.log("Помилка сервера");
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
  const selectedStudentIds = req.body.selectedStudents;

  try {
    const selectedStudents = await User.find({
      _id: { $in: selectedStudentIds },
    });

    const templateId = req.body.selectedTemplateId;
    const template = await Template.findById(templateId);

    const image = fs.readFileSync(template.imagePath);
    const base64Image = new Buffer.from(image).toString("base64");
    const dataURI = "data:image/jpeg;base64," + base64Image;

    let studentsCnt = selectedStudents.length;
    const sertificates = [];
    selectedStudents.forEach((student) => {
      console.log(`Creating the sertificate for ${student.name}`);

      const html = `
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
              width: 900px;
              height: 400px;
            }
            .certificate {
              width: 900px;
              height: 400px;
            }
            .certificate .title {
                position: absolute;                  
                font-size: 24px;
                color: ${template.title_color};
                top: ${template.title_top}px;
                left: ${template.title_left}px;
                z-index: 999;
            }
            .certificate .duration {
                position: absolute; 
                font-size: 18px;
                color: ${template.duration_color};
                top: ${template.duration_top}px;
                left: ${template.duration_left}px;
                z-index:999
            }
            .certificate .teacher {
                position: absolute; 
                font-size: 18px;
                color: ${template.teacherSurname_color};
                top: ${template.teacherSurname_top}px;
                left: ${template.teacherSurname_left}px;
                z-index:999
            }
            .certificate .student {
              position: absolute; 
              font-size: 18px;
              color: ${template.studentName_color};
              top: ${template.studentName_top}px;
              left: ${template.studentName_left}px;
              z-index: 999;
          }
          .certificate .givingDate {
            position: absolute; 
            font-size: 18px;
            color: ${template.dateOfGiving_color};
            top: ${template.dateOfGiving_top}px;
            left: ${template.dateOfGiving_left}px;
            z-index: 999;
        }
          .cert-picture{
            position: relative;
            width: 900px;
            height: 400px;
          }
        </style>
    </head>
    <body>
        <div class="certificate">
          <div class="title">${CertData.title}</div>
          <div class="duration">${CertData.duration}</div>
          <div class="teacher">${CertData.teacherSurname}</div>
          <div class="student">${student.name}</div>
          <div class="givingDate">${CertData.dateOfGiving}</div>
          <img class="cert-picture" src="{{imageSource}}"  alt="Certificate Template">
        </div>
    </body>
    </html>
`;

      const sertPath = `./sertificates/${student.id}.png`;
      sertificates.push(sertPath);
      nodeHtmlToImage({
        output: sertPath,
        html,
        content: { imageSource: dataURI },
      }).then(async () => {
        console.log(`The image for ${student.name} was created successfully!`);
        const newCertificate = new Certificate({
          studentId: student.id,
          templateId: template.id,
          image: sertPath,
          // title: CertData.title,
          // duration: CertData.duration,
          // teacherSurname: CertData.teacherSurname,
          // dateOfGiving: CertData.dateOfGiving,
        });
        await newCertificate.save();
        //console.log(html);
        studentsCnt--;
        if (studentsCnt <= 0) {
          res.status(200).json(sertificates);
        }
      });
    });
  } catch (error) {
    console.error("Error generating certificate:", error);
  }
});

app.get("/getStudentCertificates", async (req, res) => {
  try {
    const student = req.query.userId;
    console.log(student);
    const studentCertificates = await Certificate.find({
      studentId: student,
    });
    res.status(200).json(studentCertificates);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Помилка сервера" });
  }
});

app.post("/generatePDF", async (req, res) => {
  try {
    const studentCertificates = req.body.studentCertificates;

    const doc = new PDFDocument({
      layout: "landscape",
    });

    const writeStream = fs.createWriteStream("studentCertificates.pdf");
    doc.pipe(writeStream);

    studentCertificates.forEach((certificatePath, index) => {
      doc.image(certificatePath, {
        width: 900,
        height: 400,
        cover: [doc.page.width - 100, doc.page.height - 300],
      });
      if (index !== studentCertificates.length - 1) {
        doc.addPage({
          layout: "landscape",
        });
      }
    });

    doc.end();
    writeStream.on("finish", function () {
      res.download("studentCertificates.pdf");
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Помилка сервера" });
  }
});

app.listen(3001, () => {
  console.log("Server is running");
});
