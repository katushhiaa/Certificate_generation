<template>
    <div class="carousel-wrapper">
      <Carousel>
        <Slide v-for="slide in 10" :key="slide">
          <div class="carousel__item">{{ slide }}</div>
        </Slide>
  
        <template #addons>
          <Navigation />
          <Pagination />
        </template>
      </Carousel>
    </div>
  </template>
  
  <script>
  import { defineComponent } from 'vue'
  import { Carousel, Navigation, Pagination, Slide } from 'vue3-carousel'
  
  import 'vue3-carousel/dist/carousel.css'
  
  export default defineComponent({
    name: 'CarouselComponent',
    components: {
      Carousel,
      Slide,
      Pagination,
      Navigation,
    }
  })
  </script>