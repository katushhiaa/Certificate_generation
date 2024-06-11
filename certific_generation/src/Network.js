import axios from "axios";
import authHeader from "./auth-header";
import router from "./router.js";

const ERR_BAD_REQUEST = "ERR_BAD_REQUEST";

class Network {
  constructor() {
    this.baseUrl = "https://certificate-generation-server.onrender.com";
    //this.baseUrl = "http://localhost:3001";
  }

  signUp(data) {
    return axios.post(`${this.baseUrl}/signup`, data);
  }

  login(data) {
    return axios.post(`${this.baseUrl}/login`, data);
  }

  getAllStudents() {
    //return axios.get(`${this.baseUrl}/students`, { headers: authHeader() });
    return this.authGet(`${this.baseUrl}/students`);
  }

  certificateDate(data) {
    return axios.post(`${this.baseUrl}/certificateData`, data, {
      headers: authHeader(),
    });
  }

  getCertData() {
    //return axios.get(`${this.baseUrl}/getCertData`, { headers: authHeader() });
    return this.authGet(`${this.baseUrl}/getCertData`);
  }

  saveTemplateData(data) {
    return axios.post(`${this.baseUrl}/saveTemplateData`, data, {
      headers: authHeader(),
    });
  }

  uploadFile(formData) {
    return axios.post(`${this.baseUrl}/upload`, formData, {
      headers: {
        ...authHeader(),
        "Content-Type": "multipart/form-data",
      },
    });
  }

  async generateCertificate(data) {
    return axios.post(`${this.baseUrl}/generateCertificate`, data, {
      headers: authHeader(),
    });
  }

  async getTemplates(params) {
    return this.authGet(`${this.baseUrl}/templates`, {
      params,
    });
  }

  async getCertificateImageData(params) {
    return this.authGet(`${this.baseUrl}/getCertificateImageData`, {
      params,
    });
  }

  async getStudentCertificates(params) {
    // return axios.get(`${this.baseUrl}/getStudentCertificates`, {
    //   params,
    //   headers: authHeader(),
    // });
    return this.authGet(`${this.baseUrl}/getStudentCertificates`, {
      params,
    });
  }

  async generatePDF(data, config) {
    return axios.post(`${this.baseUrl}/generatePDF`, data, config);
  }

  getPath() {
    return this.baseUrl;
  }

  get path() {
    return this.baseUrl;
  }

  authGet(url, data) {
    return axios
      .get(url, {
        ...data,
        headers: authHeader(),
      })
      .catch((error) => {
        if (error.code === ERR_BAD_REQUEST) {
          router.push("/login");
        }
        console.log(error);
      });
  }
}

export default new Network();
