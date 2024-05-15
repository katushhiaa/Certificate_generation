<template>
  <ul class="sertificates">
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
          `http://localhost:3001/getStudentCertificates?userId=${userId}`
        );
        this.sertificates = response.data.map(({ image }) => ({
          image: `http://localhost:3001${image.substring(1)}`,
          file: image,
        }));
      } catch (error) {
        console.error("Error fetching images:", error);
      }
    },
    async downloadPdf(file) {
      const response = await axios.post(`http://localhost:3001/generatePDF`, {
        studentCertificates: [file],
      });
    },
  },
};
</script>

<style>
.sertificates {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  margin: 60px 0;
  text-align: center;
  gap: 10px;
}

.sertificates li {
  margin: 0;
  padding: 0;
  list-style: none;
}
</style>
