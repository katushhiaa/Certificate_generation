<template>
  <ul class="certificates">
    <li
      v-for="(certificate, idx) in certificates"
      :key="idx"
      @click="downloadPdf(certificate)"
    >
      <img :src="'data:image/png;base64,' + certificate" alt="Certificate" />
    </li>
  </ul>
</template>

<script>
import Network from "@/Network";

export default {
  name: "StudentComp",
  data() {
    return {
      certificates: [],
    };
  },
  created() {
    this.fetchCertificates();
  },
  methods: {
    async fetchCertificates() {
      try {
        const userId = localStorage.getItem("userId");

        const response = await Network.getStudentCertificates({ userId });
        this.certificates = response.data.map(({ image }) => image);
      } catch (error) {
        console.error("Error fetching certificates:", error);
      }
    },
    async downloadPdf(image) {
      try {
        const response = await Network.generatePDF(
          { studentCertificates: [image] },
          { responseType: "blob" }
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
      } catch (error) {
        console.error("Error downloading PDF:", error);
      }
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
