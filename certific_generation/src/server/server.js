import dotenv from "dotenv";
dotenv.config({ path: path.resolve("../../.env") });

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import multer from "multer";
import path from "path";
import fs from "fs";
import nodeHtmlToImage from "node-html-to-image";
import PDFDocument from "pdfkit";
import sizeOf from "image-size";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
const app = express();

app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb" }));

const config = {
  secret: process.env.SECRET || "default_secret", // Provide a default value for testing
};

const dbUri =
  process.env.NODE_ENV === "test"
    ? "mongodb://localhost:27017/test-database"
    : "mongodb+srv://kanurevamail:0x02G24YUd6AFGbe@dimplom-cluster.yc8oa4y.mongodb.net/?retryWrites=true&w=majority&appName=Dimplom-cluster/database";

mongoose.connect(dbUri);

// mongoose.connect("mongodb://localhost:27017/database");

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB");
});

const checkToken = (req, res, next) => {
  let token = req.headers["x-access-token"];
  console.log(token);

  if (!token) {
    return res.status(403).send({ message: "No token provided!" });
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({
        message: "Unauthorized!",
      });
    }
    req.userId = decoded.id;
    next();
  });
};

const checkRole = (roles) => {
  return async (req, res, next) => {
    const token = req.headers["x-access-token"];

    if (!token) {
      return res.status(403).send({ message: "No token provided!" });
    }

    try {
      const decoded = jwt.verify(token, config.secret);
      req.userId = decoded.id;

      const user = await User.findById(req.userId);
      if (!user) {
        return res.status(404).send({
          message: "User not found",
        });
      }

      if (!roles.includes(user.role)) {
        return res.status(403).send({
          message: `Require ${roles.join(" or ")} Role!`,
        });
      }
      next();
    } catch (err) {
      return res.status(401).send({
        message: "Unauthorized!",
      });
    }
  };
};

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
  certNumber: { type: String, unique: true },
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
  image: String,
  imageWidth: Number,
  imageHeight: Number,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
  title_is_centred: Boolean,
  duration_is_centred: Boolean,
  teacherName_is_centred: Boolean,
  studentName_is_centred: Boolean,
  date_is_centered: Boolean,
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

/*app.post("/upload", upload.single("image"), (req, res) => {
  console.log(req.file);
  res.json({
    imagePath: req.file.path,
  });
});

const imagesFolderPath = path.resolve("images");
app.use("/images", express.static(imagesFolderPath));

/*app.get("/images", (req, res) => {
  const directoryPath = imagesFolderPath;
  fs.readdir(directoryPath, (err, files) => {
    if (err) {
      return console.log("Unable to scan directory: " + err);
    }
    const imagePaths = files.map((file) => `/images/${file}`);
    res.json(imagePaths);
  });
});*/

app.get("/templates", [checkToken, checkRole("teacher")], async (req, res) => {
  const { userId } = req.query;
  try {
    const templates = await Template.find({
      $or: [{ createdBy: userId }, { createdBy: null }],
    });
    res.status(200).json(templates);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Помилка сервера" });
  }
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

/*app.post("/signup", async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      return res.status(400).json({ message: "Цей email вже існує" });
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({ name, email, password: hashedPassword, role });
      await newUser.save();
      return res
        .status(201)
        .json({ message: "Користувача успішно зареєстровано" });
    }
  } catch (error) {
    console.error("Помилка під час реєстрації:", error);
    return res.status(500).json({ message: "Помилка сервера" });
  }
});*/

app.post("/signup", async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      console.error("Email already exists:", email);
      return res.status(400).json({ message: "Цей email вже існує" });
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({ name, email, password: hashedPassword, role });
      await newUser.save();
      return res
        .status(201)
        .json({ message: "Користувача успішно зареєстровано" });
    }
  } catch (error) {
    console.error("Error during signup:", error);
    return res.status(500).json({ message: "Помилка сервера" });
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user) {
      const isMatch = await bcrypt.compare(password, user.password);
      if (isMatch) {
        const token = jwt.sign({ id: user._id }, config.secret, {
          algorithm: "HS256",
          allowInsecureKeySizes: true,
          expiresIn: 86400,
        });
        console.log(token);
        res.status(200).json({
          accessToken: token,
          userId: user._id,
          role: user.role,
          name: user.name,
        });
      } else {
        return res.status(400).json({ message: "Неправильний пароль" });
      }
    } else {
      return res.status(400).json({ message: "Такого акаунту не існує" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Помилка сервера" });
  }
});

app.get("/students", [checkToken, checkRole("teacher")], async (req, res) => {
  try {
    students = await User.find({ role: "student" });
    res.status(200).json(students);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error" });
  }
});

app.post(
  "/saveTemplateData",
  [checkToken, checkRole("teacher")],
  async (req, res) => {
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
      image,
      imageWidth,
      imageHeight,
      createdBy,
      title_is_centred,
      duration_is_centred,
      teacherName_is_centred,
      studentName_is_centred,
      date_is_centered,
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
        image,
        imageWidth,
        imageHeight,
        createdBy,
        duration_is_centred,
        teacherName_is_centred,
        studentName_is_centred,
        title_is_centred,
        date_is_centered,
      });
      await newTemplate.save();
      res.status(200).json({ message: "Дані успішно збережено", image });
    } catch (error) {
      console.error("Помилка збереження даних:", error);
      res.status(500).json({ error: "Помилка сервера" });
    }
  }
);

// app.get("/getCertificateImageData", async (req, res) => {
//   try {
//     const templateId = req.body.templateId;
//     const template = await Template.findById(templateId);
//     if (!template) {
//       return res.status(404).json({ error: "Template not found" });
//     }
//     res.status(200).json({ templateId: template._id });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });

app.post(
  "/generateCertificate",
  [checkToken, checkRole("teacher")],
  async (req, res) => {
    const { CertData } = req.body;
    const selectedStudentIds = req.body.selectedStudents;

    try {
      const selectedStudents = await User.find({
        _id: { $in: selectedStudentIds },
      });

      const templateId = req.body.selectedTemplateId;
      const template = await Template.findById(templateId);

      if (!template) {
        return res.status(404).json({ error: "Template not found" });
      }

      if (template.image) {
        const dataURI = template.image;
        let studentsCnt = selectedStudents.length;
        const sertificates = [];
        const targetWidth = 1200;
        const scaleFactor = template.imageWidth / targetWidth;
        selectedStudents.forEach((student) => {
          console.log(`Creating the certificate for ${student.name}`);
          const certNumber = `CERT-${Date.now()}-${Math.floor(
            Math.random() * 1000
          )}`;

          const adjustedTemplate = {
            ...template,
            title_top: template.title_top / scaleFactor + 15,
            title_left: template.title_left / scaleFactor,
            duration_top: template.duration_top / scaleFactor + 10,
            duration_left: template.duration_left / scaleFactor,
            teacherSurname_top: template.teacherSurname_top / scaleFactor + 10,
            teacherSurname_left: template.teacherSurname_left / scaleFactor,
            studentName_top: template.studentName_top / scaleFactor + 10,
            studentName_left: template.studentName_left / scaleFactor,
            dateOfGiving_top: template.dateOfGiving_top / scaleFactor + 15,
            dateOfGiving_left: template.dateOfGiving_left / scaleFactor,
            title_is_centred: template.title_is_centred,
            duration_is_centred: template.duration_is_centred,
            teacherName_is_centred: template.teacherName_is_centred,
            studentName_is_centred: template.studentName_is_centred,
            date_is_centered: template.date_is_centered,
          };

          console.log(adjustedTemplate.studentName_is_centred);
          // transform: translateX(-50%);
          // width: 80%;
          // white-space: pre-wrap;
          // word-wrap: break-word;
          // text-align: center;

          const center = "transform: translateX(-50%);";

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
                  width: ${targetWidth}px;
                  height: auto;
                  position: relative;
                }
                .certificate {
                  width: ${targetWidth}px;
                  height: auto;
                  position: relative;
                }
                .certificate .title {
                    position: absolute;                  
                    font-size: 20px;
                    color: ${adjustedTemplate.title_color};
                    top: ${adjustedTemplate.title_top}px;
                    left: ${adjustedTemplate.title_left}px;;
                    ${adjustedTemplate.title_is_centred ? center : ""}
                    z-index: 999;
                }
                .certificate .duration {
                    position: absolute; 
                    font-size: 18px;
                    color: ${adjustedTemplate.duration_color};
                    top: ${adjustedTemplate.duration_top}px;
                    left: ${adjustedTemplate.duration_left}px;
                    ${adjustedTemplate.duration_is_centred ? center : ""}
                    z-index:999
                }
                .certificate .teacher {
                    position: absolute; 
                    font-size: 18px;
                    color: ${adjustedTemplate.teacherSurname_color};
                    top: ${adjustedTemplate.teacherSurname_top}px;
                    left: ${adjustedTemplate.teacherSurname_left}px;
                    ${adjustedTemplate.teacherName_is_centred ? center : ""}
                    z-index:999
                }
                .certificate .student {
                  position: absolute; 
                  font-size: 18px;
                  color: ${adjustedTemplate.studentName_color};
                  top: ${adjustedTemplate.studentName_top}px;
                  left: ${adjustedTemplate.studentName_left}px;
                  ${adjustedTemplate.studentName_is_centred ? center : ""}
                  z-index: 999;
              }
              .certificate .givingDate {
                position: absolute; 
                font-size: 18px;
                color: ${adjustedTemplate.dateOfGiving_color};
                top: ${adjustedTemplate.dateOfGiving_top}px;
                left: ${adjustedTemplate.dateOfGiving_left}px;
                ${adjustedTemplate.date_is_centered ? center : ""}
                z-index: 999;
            }
              .cert-picture{
                position: relative;
                width: ${targetWidth}px;
                height: auto;
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
              <img class="cert-picture" src="{{imageSource}}" alt="Certificate Template">
            </div>
        </body>
        </html>
      `;
          nodeHtmlToImage({
            html,
            content: { imageSource: dataURI },
            encoding: "buffer",
          }).then(async (imageBuffer) => {
            const base64Image = imageBuffer.toString("base64");
            console.log(
              `The image for ${student.name} was created successfully!`
            );
            const newCertificate = new Certificate({
              studentId: student.id,
              templateId: template.id,
              image: base64Image,
              certNumber: certNumber,
              title: CertData.title,
              duration: CertData.duration,
              teacherSurname: CertData.teacherSurname,
              dateOfGiving: CertData.dateOfGiving,
            });
            //await newCertificate.save();
            sertificates.push(base64Image);
            //console.log(html);
            studentsCnt--;
            if (studentsCnt <= 0) {
              res.status(200).json(sertificates);
            }
          });
        });
      }
    } catch (error) {
      console.error("Error generating certificate:", error);
    }
  }
);

app.get(
  "/getStudentCertificates",
  [checkToken, checkRole("student")],
  async (req, res) => {
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
  }
);

app.post(
  "/generatePDF",
  /*[checkToken /*checkRole(["teacher", "student"])],*/
  async (req, res) => {
    try {
      const studentCertificates = req.body.studentCertificates;

      if (!studentCertificates || studentCertificates.length === 0) {
        console.error("No certificates provided");
        return res.status(400).json({ error: "No certificates provided" });
      }

      const a4Dimensions = [595, 842];
      const margin = 0;

      const doc = new PDFDocument({
        size: a4Dimensions,
        margin: margin,
        layout: "landscape",
      });

      const writeStream = fs.createWriteStream("studentCertificates.pdf");
      doc.pipe(writeStream);

      studentCertificates.forEach((certificatePath, index) => {
        const imageBuffer = Buffer.from(certificatePath, "base64");

        if (!imageBuffer) {
          console.error(`Error converting certificate ${index + 1} to buffer`);
          return res.status(500).json({
            error: `Error converting certificate ${index + 1} to buffer`,
          });
        }

        const imageDimensions = sizeOf(imageBuffer);

        const pageWidth = a4Dimensions[1];
        const pageHeight = a4Dimensions[0];
        const imageAspect = imageDimensions.width / imageDimensions.height;
        const pageAspect = pageWidth / pageHeight;

        let width, height;
        if (imageAspect > pageAspect) {
          width = pageWidth;
          height = pageWidth / imageAspect;
        } else {
          height = pageHeight;
          width = pageHeight * imageAspect;
        }

        const x = (pageWidth - width) / 2;
        const y = (pageHeight - height) / 2;

        doc.image(imageBuffer, x, y, {
          width: width,
          height: height,
        });

        if (index !== studentCertificates.length - 1) {
          doc.addPage({
            size: a4Dimensions,
            margin: margin,
            layout: "landscape",
          });
        }
      });

      doc.end();
      writeStream.on("finish", function () {
        res.download("studentCertificates.pdf");
      });
    } catch (error) {
      console.error("Server error:", error);
      res.status(500).json({ error: "Server error" });
    }
  }
);

if (process.env.NODE_ENV !== "test") {
  app.listen(3001, () => {
    console.log("Server is running");
  });
}

export default app;
