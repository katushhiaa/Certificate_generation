<template>
  <div class="final_wrapper">
    <div class="carousel">
      <Carousel>
        <Slide v-for="template in templates" :key="template.class">
          <div class="carousel__item">
            <img :src="template.image" />
          </div>
        </Slide>
        <template #addons>
          <Navigation />
          <Pagination />
        </template>
      </Carousel>
    </div>
    <div>
      <label for="file-upload" class="input-box button">
        <input
          id="file-upload"
          type="file"
          @change="chooseTemplate"
          style="display: none"
        />
        <span class="custom-button">Вибрати свій</span>
      </label>
    </div>
  </div>
</template>

<script>
import { defineComponent } from "vue";
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
      templates: [
        { image: "src/components/img/template1.png" },
        { image: "src/components/img/template2.png" },
        { image: "src/components/img/template3.png" },
        { image: "src/components/img/template4.png" },
        { image: "src/components/img/template5.png" },
        { image: "src/components/img/template6.png" },
        { image: "src/components/img/template7.png" },
        { image: "src/components/img/template8.png" },
        { image: "src/components/img/template9.png" },
      ],
    };
  },
  methods: {
    chooseTemplate(event) {
      const file = event.target.files[0];
      if (file) {
        const imageUrl = URL.createObjectURL(file);
        this.templates.push({ image: imageUrl });
        console.log(this.templates);
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

.input-box.button {
  cursor: pointer;
}

.custom-button {
  display: inline-block;
  padding: 10px 20px;
  background-color: #ab4c37;
  color: #fff;
  border-radius: 5px;
  font-size: 16px;
  transition: background-color 0.3s ease;
}

.custom-button:hover {
  background-color: #ab4c37;
}
</style>
