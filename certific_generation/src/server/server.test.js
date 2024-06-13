import request from "supertest";
import mongoose from "mongoose";
import app from "./server.js";

describe("API Endpoints", () => {
  beforeAll(async () => {
    const dbUri = "mongodb://localhost:27017/test-database";
    await mongoose.connect(dbUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

  describe("POST /signup", () => {
    it("should create a new user", async () => {
      const res = await request(app).post("/signup").send({
        name: "New User",
        email: "newuser@example.com",
        password: "password123",
        role: "student",
      });
      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty(
        "message",
        "Користувача успішно зареєстровано"
      );
    });

    it("should not create a user with existing email", async () => {
      const res = await request(app).post("/signup").send({
        name: "Test User",
        email: "newuser@example.com",
        password: "password123",
        role: "student",
      });
      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty("message", "Цей email вже існує");
    });
  });

  describe("POST /login", () => {
    it("should login a user", async () => {
      await request(app).post("/signup").send({
        name: "Test User",
        email: "testlogin@example.com",
        password: "password123",
        role: "teacher",
      });

      const res = await request(app).post("/login").send({
        email: "testlogin@example.com",
        password: "password123",
      });
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty("accessToken");
    });

    it("should not login a user with wrong password", async () => {
      const res = await request(app).post("/login").send({
        email: "testlogin@example.com",
        password: "wrongpassword",
      });
      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty("message", "Неправильний пароль");
    });
  });

  describe("GET /templates", () => {
    let token, userId;

    beforeEach(async () => {
      await request(app).post("/signup").send({
        name: "Test Teacher",
        email: "teacher@example.com",
        password: "password123",
        role: "teacher",
      });

      const loginRes = await request(app).post("/login").send({
        email: "teacher@example.com",
        password: "password123",
      });
      token = loginRes.body.accessToken;
      userId = loginRes.body.userId;
    });

    it("should get templates for a teacher", async () => {
      const res = await request(app)
        .get("/templates")
        .set("x-access-token", token)
        .query({ userId });

      expect(res.statusCode).toEqual(200);
      expect(Array.isArray(res.body)).toBeTruthy();
    });
  });

  describe("GET /students", () => {
    let token;

    beforeEach(async () => {
      await request(app).post("/signup").send({
        name: "Test Teacher",
        email: "teacher@example.com",
        password: "password123",
        role: "teacher",
      });

      const loginRes = await request(app).post("/login").send({
        email: "teacher@example.com",
        password: "password123",
      });
      token = loginRes.body.accessToken;
    });

    it("should get students for a teacher", async () => {
      const res = await request(app)
        .get("/students")
        .set("x-access-token", token);

      expect(res.statusCode).toEqual(200);
      expect(Array.isArray(res.body)).toBeTruthy();
    });
  });

  describe("POST /saveTemplateData", () => {
    let token, userId;

    beforeEach(async () => {
      const signupRes = await request(app).post("/signup").send({
        name: "Test Teacher",
        email: "teacher@example.com",
        password: "password123",
        role: "teacher",
      });

      const loginRes = await request(app).post("/login").send({
        email: "teacher@example.com",
        password: "password123",
      });
      token = loginRes.body.accessToken;
      userId = signupRes.body.userId;
    });

    it("should save template data", async () => {
      const res = await request(app)
        .post("/saveTemplateData")
        .set("x-access-token", token)
        .send({
          title_color: "red",
          title_top: 100,
          title_left: 50,
          duration_color: "blue",
          duration_top: 150,
          duration_left: 70,
          teacherSurname_color: "green",
          teacherSurname_top: 200,
          teacherSurname_left: 90,
          studentName_color: "purple",
          studentName_top: 250,
          studentName_left: 110,
          dateOfGiving_color: "orange",
          dateOfGiving_top: 300,
          dateOfGiving_left: 130,
          image: "data:image/png;base64,...",
          imageWidth: 800,
          imageHeight: 600,
          createdBy: userId,
          title_is_centred: true,
          duration_is_centred: true,
          teacherName_is_centred: true,
          studentName_is_centred: true,
          date_is_centered: true,
        });

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty("message", "Дані успішно збережено");
    });
  });

  describe("POST /generateCertificate", () => {
    let token, userId, templateId;

    beforeEach(async () => {
      const signupRes = await request(app).post("/signup").send({
        name: "Test Teacher",
        email: "teacher@example.com",
        password: "password123",
        role: "teacher",
      });

      const loginRes = await request(app).post("/login").send({
        email: "teacher@example.com",
        password: "password123",
      });
      token = loginRes.body.accessToken;
      userId = signupRes.body.userId;

      const templateRes = await request(app)
        .post("/saveTemplateData")
        .set("x-access-token", token)
        .send({
          title_color: "red",
          title_top: 100,
          title_left: 50,
          duration_color: "blue",
          duration_top: 150,
          duration_left: 70,
          teacherSurname_color: "green",
          teacherSurname_top: 200,
          teacherSurname_left: 90,
          studentName_color: "purple",
          studentName_top: 250,
          studentName_left: 110,
          dateOfGiving_color: "orange",
          dateOfGiving_top: 300,
          dateOfGiving_left: 130,
          image: "./image.png",
          imageWidth: 800,
          imageHeight: 600,
          createdBy: userId,
          title_is_centred: true,
          duration_is_centred: true,
          teacherName_is_centred: true,
          studentName_is_centred: true,
          date_is_centered: true,
        });
      templateId = templateRes.body._id;
    });

    it("should generate certificate", async () => {
      const res = await request(app)
        .post("/generateCertificate")
        .set("x-access-token", token)
        .send({
          CertData: {
            title: "Certificate Title",
            duration: "10 hours",
            teacherSurname: "Doe",
            dateOfGiving: "2024-01-01",
          },
          selectedStudents: [userId],
          selectedTemplateId: templateId,
        });

      expect(res.statusCode).toEqual(200);
      expect(Array.isArray(res.body)).toBeTruthy();
    }, 10000);
  });
});
