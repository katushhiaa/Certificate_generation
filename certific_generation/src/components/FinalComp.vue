<template>
  <div class="final_wrapper">
    <div class="carousel-wrapper">
      <div class="carousel">
        <Carousel>
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
        >
          Згенерувати сертифікат
        </button>
      </div>
      <ul class="generated-sertificats">
        <li v-for="(image, idx) in generatedSerts" :key="idx">
          <img :src="image" alt="Template" />
        </li>
      </ul>
    </div>
    <div id="certificate" v-html="htmlTemplate"></div>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import axios from "axios";
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
    };
  },
  created() {
    this.fetchImages();
  },
  methods: {
    async fetchImages() {
      try {
        const response = await axios.get("http://localhost:3001/images");
        this.templates = response.data.map((imagePath) => ({
          image: `http://localhost:3001${imagePath}`,
        }));
      } catch (error) {
        console.error("Error fetching images:", error);
      }
    },
    async selectTemplate(template) {
      try {
        const response = await axios.get(
          "http://localhost:3001/getCertificateImageData",
          {
            params: {
              imagePath: template.image.slice(22).replace(/\//g, "\\"),
            },
          }
        );
        const templateId = response.data.templateId;
        localStorage.setItem("selectedTemplateId", templateId);
        console.log("Selected template ID:", templateId);
      } catch (error) {
        console.error("Error selecting template:", error);
      }
    },
    async generateCertificate() {
      const selectedStudents = JSON.parse(
        localStorage.getItem("selectedStudents")
      );
      const selectedTemplateId = localStorage.getItem("selectedTemplateId");
      const CertData = JSON.parse(localStorage.getItem("CertData"));

      try {
        const response = await Network.generateCertificate({
          selectedStudents,
          selectedTemplateId,
          CertData,
        });
        console.log(response.data);

        this.generatedSerts = response.data.map(
          (img) => `http://localhost:3001${img.substring(1)}`
        );

        // const htmlTemplate = "";

        // this.htmlTemplate = htmlTemplate;
      } catch (error) {
        console.error(error);
      }
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
  width: 1500px;
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
</style>
