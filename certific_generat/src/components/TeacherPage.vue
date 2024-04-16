<template>
  <div class="teacher">
    <div class="wrapper">
      <div class="form-wrapper">
        <h2>Введіть дані сертифікату</h2>
        <form @submit.prevent="generateCertificate">
          <div class="input-box">
            <input
              v-model="formData.title"
              type="text"
              id="title"
              required
              placeholder="Назва заходу (участь в)"
            />
          </div>
          <div class="input-box">
            <input
              v-model="formData.duration"
              type="text"
              id="duration"
              required
              placeholder="Тривалість (Наприклад: 1 година)"
            />
          </div>
          <div class="input-box">
            <input
              v-model="formData.teacherSurname"
              type="text"
              id="surname-teacher"
              required
              placeholder="Прізвище та ініціали викладача, який проводив захід"
            />
          </div>
          <div class="input-box">
            <input
              v-model="formData.studentCount"
              type="number"
              min="1"
              id="students-count"
              required
              placeholder="Кількість студентів"
            />
          </div>
          <div class="input-box">
            <input
              v-model="formData.studentSurname"
              type="text"
              id="surname-student"
              required
              placeholder="Прізвища та ініціали для кожного студента"
            />
          </div>
          <div class="input-box button">
            <button type="submit">Додати</button>
          </div>
        </form>
      </div>
    </div>
    <div>
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
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import { Carousel, Navigation, Pagination, Slide } from 'vue3-carousel'

import 'vue3-carousel/dist/carousel.css'
export default defineComponent({
  name: 'TeacherPage',
  components: {
    Carousel,
    Slide,
    Pagination,
    Navigation
  },
  data() {
    return {
      formData: {
        title: '',
        duration: '',
        teacherSurname: '',
        studentCount: '',
        studentSurname: ''
      },
      templates: [
        { image: 'img/template6.png', class: 'template6' },
        { image: 'img/template1.png', class: 'template1' },
        { image: 'img/template2.png', class: 'template2' },
        { image: 'img/template3.png', class: 'template3' },
        { image: 'img/template7.png', class: 'template7' },
        { image: 'img/template9.png', class: 'template9' },
        { image: 'img/template4.png', class: 'template4' },
        { image: 'img/template5.png', class: 'template5' },
        { image: 'img/template8.png', class: 'template8' },
        { image: 'img/template10.png', class: 'template10' }
      ]
    }
  },
  methods: {
    generateCertificate() {},
    chooseTemplate() {}
  }
})
</script>

<style></style>
