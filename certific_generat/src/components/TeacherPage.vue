<template>
  <div class="teacher">
    <div class="wrapper">
      <div class="teacherContainer">
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
        <div class="carousel-wrapper">
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
        { image: 'src/components/img/template1.png' },
        { image: 'src/components/img/template2.png' },
        { image: 'src/components/img/template3.png' },
        { image: 'src/components/img/template4.png' },
        { image: 'src/components/img/template5.png' },
        { image: 'src/components/img/template6.png' },
        { image: 'src/components/img/template7.png' },
        { image: 'src/components/img/template8.png' },
        { image: 'src/components/img/template9.png' }
      ]
    }
  },
  methods: {
    generateCertificate() {},
    chooseTemplate() {}
  }
})
</script>

<style>
.teacherContainer {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.carousel-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
  padding: 70px 300px;
}

.carousel__item img {
  max-width: 100%;
  max-height: 600px;
}
</style>
