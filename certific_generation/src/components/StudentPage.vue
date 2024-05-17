<template>
  <ul class="certificates">
    <li
      v-for="({ image, file }, idx) in sertificates"
      :key="idx"
      @click="downloadPdf(file)"
    >
      <img :src="image" alt="Template" />
    </li>
  </ul>
</template>

<script>
import axios from "axios";

export default {
  name: "StudentComp",
  data() {
    return {
      sertificates: [],
    };
  },
  created() {
    this.fetchSertificates();
  },
  methods: {
    async fetchSertificates() {
      try {
        const userId = localStorage.getItem("userId");

        const response = await axios.get(
          `http://10.223.178.212:5173/getStudentCertificates?userId=${userId}`
        );
        this.sertificates = response.data.map(({ image }) => ({
          image: `http://10.223.178.212:5173${image.substring(1)}`,
          file: image,
        }));
      } catch (error) {
        console.error("Error fetching images:", error);
      }
    },
    async downloadPdf(file) {
      const response = await axios.post(
        `http://10.223.178.212:5173/generatePDF`,
        {
          studentCertificates: [file],
        },
        {
          responseType: "blob",
        }
      );
      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "studentCertificates.pdf");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    },
  },
};
</script>

<style>
.certificates {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  margin: 60px 0;
  text-align: center;
  gap: 10px;
}

.certificates li {
  margin: 0;
  padding: 0;
  list-style: none;
}
</style>
