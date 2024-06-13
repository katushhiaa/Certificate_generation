<template>
  <div class="carousel">
    <Carousel
      @slide-start="handleSlideStart"
      @init="handleInit"
      v-if="certificates && certificates.length > 0"
    >
      <Slide v-for="(certificate, idx) in certificates" :key="idx">
        <div class="carousel__item">
          <img
            :src="'data:image/png;base64,' + certificate"
            alt="Certificate"
          />
        </div>
      </Slide>
      <template #addons>
        <Navigation />
        <Pagination />
      </template>
    </Carousel>
    <div
      class="input-box button"
      v-if="certificates && certificates.length > 0"
    >
      <button
        @click="printCertificate"
        style="width: 250px; height: 50px; margin: 10px"
      >
        Друкувати
      </button>
      <button
        @click="downloadPDF"
        style="width: 250px; height: 50px; margin: 10px"
      >
        Завантажити в PDF
      </button>
    </div>
    <div v-if="!certificates || certificates.length === 0">
      У вас ще немає сертифікатів
    </div>
  </div>
</template>
<script>
import Network from "@/Network";
import { Carousel, Navigation, Pagination, Slide } from "vue3-carousel";
import "vue3-carousel/dist/carousel.css";

export default {
  name: "StudentComp",
  components: {
    Carousel,
    Slide,
    Pagination,
    Navigation,
  },
  data() {
    return {
      certificates: [],
      currentCertificate: null,
    };
  },
  created() {
    this.fetchCertificates();
  },
  methods: {
    handleInit() {
      if (this.certificates.length) {
        this.selectCert(this.certificates[0]);
      }
    },
    handleSlideStart(data) {
      this.selectCert(this.certificates[data.slidingToIndex]);
    },
    async selectCert(certificate) {
      try {
        this.currentCertificate = certificate;
        console.log("Selected certificate:", certificate);
      } catch (error) {
        console.error("Error selecting certificate:", error);
      }
    },
    async fetchCertificates() {
      try {
        const userId = localStorage.getItem("userId");
        const response = await Network.getStudentCertificates({ userId });
        this.certificates = response.data.map(({ image }) => image);
        if (this.certificates.length > 0) {
          this.currentCertificate = this.certificates[0];
        }
      } catch (error) {
        console.error("Error fetching certificates:", error);
      }
    },
    async downloadPDF() {
      try {
        if (!this.currentCertificate) {
          console.error("No certificate selected");
          return;
        }

        const response = await Network.generatePDF(
          { studentCertificates: [this.currentCertificate] },
          { responseType: "blob" }
        );
        const blob = new Blob([response.data], { type: "application/pdf" });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "certificate.pdf");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

        this.$nextTick(() => {});
      } catch (error) {
        console.error("Error downloading PDF:", error);
      }
    },
    printCertificate() {
      if (!this.currentCertificate) {
        console.error("No certificate selected");
        return;
      }

      const printWindow = window.open("", "_blank");
      printWindow.document.write(
        "<html><head><title>Print Certificates</title></head><body>"
      );

      printWindow.document.write(
        `<img src="data:image/png;base64,${this.currentCertificate}" style="width: 100%; page-break-after: always;" />`
      );
      printWindow.document.write("</body></html>");
      printWindow.document.close();
      printWindow.print();

      this.$nextTick(() => {});
    },
  },
};
</script>

<style>
.carousel__item {
  position: relative;
  text-align: center;
}

.buttons {
  position: absolute;
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 10px;
}
</style>
