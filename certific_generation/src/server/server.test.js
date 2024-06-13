import request from "supertest";
import mongoose from "mongoose";
import app from "./server.js";

jest.setTimeout(60000);

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
    it("повинно створити нового користувача", async () => {
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
    }, 10000);

    it("не повинно створювати користувача з email який вже існує", async () => {
      const res = await request(app).post("/signup").send({
        name: "Test User",
        email: "newuser@example.com",
        password: "password123",
        role: "student",
      });
      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty("message", "Цей email вже існує");
    }, 10000);
  });

  describe("POST /login", () => {
    it("користувач повинен успішно увійти в систему", async () => {
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
    }, 10000);

    it("користувач не може увійти з неправильним паролем", async () => {
      const res = await request(app).post("/login").send({
        email: "testlogin@example.com",
        password: "wrongpassword",
      });
      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty("message", "Неправильний пароль");
    }, 10000);
  });

  describe("GET /templates", () => {
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
      userId = loginRes.body.userId;
    }, 10000);

    it("повинен отримати шаблони для викладача", async () => {
      const res = await request(app)
        .get("/templates")
        .set("x-access-token", token)
        .query({ userId });

      expect(res.statusCode).toEqual(200);
      expect(Array.isArray(res.body)).toBeTruthy();
    }, 10000);
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
    }, 10000);

    it("повинен отримати студентів щоб відобразити викладачу", async () => {
      const res = await request(app)
        .get("/students")
        .set("x-access-token", token);

      expect(res.statusCode).toEqual(200);
      expect(Array.isArray(res.body)).toBeTruthy();
    }, 10000);
  });

  describe("POST /saveTemplateData", () => {
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
      userId = loginRes.body.userId;
    }, 10000);

    it("повинен зберегти дані про шаблон сертифікату", async () => {
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
          image: "./image.png",
          imageWidth: 800,
          imageHeight: 600,
          createdBy: userId,
          title_is_centred: true,
          duration_is_centred: true,
          teacherName_is_centред: true,
          studentName_is_centред: true,
          date_is_centered: true,
        });

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty("message", "Дані успішно збережено");
      templateId = res.body._id;
    }, 10000);

    describe("POST /generateCertificate", () => {
      it("повинен згенерувати сертифікат", async () => {
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
      }, 100000);
    });
  });
});
