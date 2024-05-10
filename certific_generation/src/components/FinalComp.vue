<template>
  <div class="final_wrapper">
    <div class="carousel">
      <Carousel>
        <Slide v-for="template in templates" :key="template.image">
          <div class="carousel__item">
            <img :src="template.image" alt="Template" />
          </div>
        </Slide>
        <template #addons>
          <Navigation />
          <Pagination />
        </template>
      </Carousel>
    </div>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import axios from "axios";
import { Carousel, Navigation, Pagination, Slide } from "vue3-carousel";
import "vue3-carousel/dist/carousel.css";

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
  },
});
</script>

<style>
.carousel-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
  padding: 70px 300px;
}
.carousel__item img {
  max-width: 100%;
  max-height: 300px;
}
</style>
