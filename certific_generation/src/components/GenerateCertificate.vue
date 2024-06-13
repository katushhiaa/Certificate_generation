<template>
  <div class="final_wrapper">
    <div v-if="hasTemplates()" class="carousel-wrapper">
      <div class="carousel">
        <Carousel @slide-start="handleSlideStart" @init="handleInit">
          <Slide v-for="template in templates" :key="template.image">
            <div class="carousel__item">
              <img
                :src="template.image"
                alt="Template"
                @click="selectTemplate(template)"
              />
            </div>
          </Slide>
          <template #addons>
            <Navigation />
            <Pagination />
          </template>
        </Carousel>
      </div>
      <div class="input-box button">
        <button
          @click="generateCertificate"
          type="submit"
          style="width: 250px; height: 50px; margin: 10px"
          :disabled="isLoading"
          class="generate-button"
        >
          <span v-if="!isLoading"
            >Згенерувати сертифікат ({{ selectedStudentsCount }})</span
          >
          <span v-if="isLoading">Зачекайте...</span>
        </button>
        <button
          @click="createNewCertificate"
          style="width: 250px; height: 50px; margin: 10px"
        >
          Створити шаблон
        </button>
        <button
          v-if="isGenerated"
          @click="printCertificates"
          style="width: 250px; height: 50px; margin: 10px"
        >
          Друкувати
        </button>
        <button
          v-if="isGenerated"
          @click="downloadPDF"
          style="width: 250px; height: 50px; margin: 10px"
        >
          Завантажити в ПДФ
        </button>
      </div>
      <ul class="generated-sertificats" style="width: 100vw; padding: 0">
        <li v-for="(image, idx) in generatedSerts" :key="idx">
          <img
            :src="'data:image/png;base64,' + image"
            alt="Template"
            style="width: 100vw"
          />
        </li>
      </ul>
    </div>
    <div v-if="!hasTemplates()">
      <button
        @click="createNewCertificate"
        style="width: 250px; height: 50px; margin: 10px"
      >
        Додати сертифікат
      </button>
    </div>
    <div id="certificate" v-html="htmlTemplate"></div>
    <button
      type="button"
      @click="goBack"
      class="back-button"
      style="color: #ffffff"
    >
      ← Назад
    </button>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import { Carousel, Navigation, Pagination, Slide } from "vue3-carousel";
import "vue3-carousel/dist/carousel.css";
import Network from "@/Network";

export default defineComponent({
  name: "GenerateCertificate",
  components: {
    Carousel,
    Slide,
    Pagination,
    Navigation,
  },
  data() {
    return {
      templates: [],
      htmlTemplate: "",
      generatedSerts: [],
      selectedTempate: "",
      selectedStudentsCount: 0,
      isLoading: false,
      isGenerated: false,
    };
  },
  created() {
    this.fetchTemplates();
    this.computeSelectedStudentsCount();
  },
  methods: {
    async computeSelectedStudentsCount() {
      const selectedStudents = JSON.parse(
        localStorage.getItem("selectedStudents")
      );
      this.selectedStudentsCount = selectedStudents
        ? selectedStudents.length
        : 0;
    },
    async downloadPDF() {
      try {
        const response = await Network.generatePDF(
          { studentCertificates: this.generatedSerts },
          { responseType: "blob" }
        );
        const blob = new Blob([response.data], { type: "application/pdf" });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "certificates.pdf");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        this.$nextTick(() => {});
      } catch (error) {
        console.error("Error downloading PDF:", error);
      }
    },
    handleInit() {
      if (this.templates.length) {
        this.selectTemplate(this.templates[0]);
      }
    },
    handleSlideStart(data) {
      this.selectTemplate(this.templates[data.slidingToIndex]);
    },
    hasTemplates() {
      return this.templates.length;
    },
    async fetchTemplates() {
      try {
        const userId = localStorage.getItem("userId");
        const response = await Network.getTemplates({ userId });
        this.templates = response.data;
      } catch (error) {
        console.error("Error fetching templates:", error);
      }
    },
    async selectTemplate(template) {
      try {
        this.selectedTempate = template._id;

        console.log("Selected template ID:", template._id);
      } catch (error) {
        console.error("Error selecting template:", error);
      }
    },
    printCertificates() {
      const printWindow = window.open("", "_blank");
      printWindow.document.write(
        "<html><head><title>Print Certificates</title></head><body>"
      );
      this.generatedSerts.forEach((image) => {
        printWindow.document.write(
          `<img src="data:image/png;base64,${image}" style="width: 100%; page-break-after: always;" />`
        );
      });
      printWindow.document.write("</body></html>");
      printWindow.document.close();
      printWindow.print();
      this.$nextTick(() => {});
    },
    async generateCertificate() {
      const selectedStudents = JSON.parse(
        localStorage.getItem("selectedStudents")
      );
      const CertData = JSON.parse(localStorage.getItem("CertData"));

      try {
        this.isLoading = true;
        const response = await Network.generateCertificate({
          selectedStudents,
          selectedTemplateId: this.selectedTempate,
          CertData,
        });
        console.log(response.data);

        this.generatedSerts = response.data;
        this.isLoading = false;
        this.isGenerated = true;
      } catch (error) {
        console.error(error);
      }
    },
    createNewCertificate() {
      this.$router.push("/createCertificate");
    },
    goBack() {
      this.$router.push("/teacher");
    },
  },
});
</script>

<style>
.carousel__item img {
  max-width: 100%;
  max-height: 300px;
  cursor: pointer;
}

.final_wrapper {
  margin: 0 auto;
  display: flex;
  flex-direction: row;
}

.carousel-wrapper {
  margin-right: 20px;
}

.input-box {
  display: flex;
  justify-content: center;
  align-items: center;
}

#certificate {
  margin: -50px 10px 0 0;
}

.generated-sertificats {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  margin: 60px 0;
  text-align: center;
  gap: 10px;
}

.generated-sertificats li {
  margin: 0;
  padding: 0;
  list-style: none;
  width: 100vw;
}

.input-box.button button.generate-button:disabled {
  background: #555;
}
.back-button {
  position: absolute;
  top: 70px;
  left: 10px;
  padding: 10px 20px;
  color: #fff;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  border: none;
}

@media (max-width: 767px) {
  .back-button {
    top: 50px;
  }
}
</style>
