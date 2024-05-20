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
          <span v-if="!isLoading">Згенерувати сертифікат</span>
          <span v-if="isLoading">Зачекайте...</span>
        </button>
        <button
          @click="createNewCertificate"
          style="width: 250px; height: 50px; margin: 10px"
        >
          Додати Сертифікат
        </button>
      </div>
      <ul class="generated-sertificats">
        <li v-for="(image, idx) in generatedSerts" :key="idx">
          <img :src="'data:image/png;base64,' + image" alt="Template" />
        </li>
      </ul>
    </div>
    <div v-if="!hasTemplates()">
      <button
        @click="createNewCertificate"
        style="width: 250px; height: 50px; margin: 10px"
      >
        Додати Сертифікат
      </button>
    </div>
    <div id="certificate" v-html="htmlTemplate"></div>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import { Carousel, Navigation, Pagination, Slide } from "vue3-carousel";
import "vue3-carousel/dist/carousel.css";
import Network from "@/Network";

export default defineComponent({
  name: "FinalComp",
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
      isLoading: false,
    };
  },
  created() {
    this.fetchTemplates();
  },
  methods: {
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
        const response = await Network.getTemplates();
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
      } catch (error) {
        console.error(error);
      }
    },
    createNewCertificate() {
      this.$router.push("/createCertificate");
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
}

.input-box.button button.generate-button:disabled {
  background: #555;
}
</style>
