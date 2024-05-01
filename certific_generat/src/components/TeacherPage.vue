<template>
  <div class="teacher">
    <div class="container">
      <div class="row">
        <div class="col-md-6">
          <div class="teacherContainer">
            <div class="card">
              <div class="card-header">
                <label class="form-checkbox">
                  <input type="checkbox" @click="selectAll" /> Вибрати всіх
                  <input type="checkbox" @click="clearSelection" /> Відмінити обрання всіх
                </label>
                <tr v-for="student in data.students" :key="student.id">
                  <td>
                    <input type="checkbox" v-model="selectedStudents" :value="student" />
                  </td>
                  <td>
                    {{ student.name }}
                  </td>
                </tr>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-6">
          <div class="form-wrapper">
            <h2>Введіть дані сертифікату</h2>
            <form @submit.prevent="generateCertificate">
              <div class="mb-3">
                <input
                  v-model="data.title"
                  type="text"
                  id="title"
                  required
                  class="form-control"
                  placeholder="Назва заходу (участь в)"
                />
              </div>
              <div class="mb-3">
                <input
                  v-model="data.duration"
                  type="text"
                  id="duration"
                  required
                  class="form-control"
                  placeholder="Тривалість (Наприклад: 1 година)"
                />
              </div>
              <div class="mb-3">
                <input
                  v-model="data.teacherSurname"
                  type="text"
                  id="surname-teacher"
                  required
                  class="form-control"
                  placeholder="Прізвище та ініціали викладача, який проводив захід"
                />
              </div>
              <div class="input-box button">
                <button type="submit">Додати</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<!--<div class="carousel-wrapper">
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
        </div>-->

<script>
import { defineComponent } from 'vue'
import Network from '@/Network'

//import { Carousel, Navigation, Pagination, Slide } from 'vue3-carousel'

import 'vue3-carousel/dist/carousel.css'
export default defineComponent({
  name: 'TeacherPage',
  /*components: {
    Carousel,
    Slide,
    Pagination,
    Navigation
  }*/
  data() {
    return {
      data: {
        title: '',
        duration: '',
        teacherSurname: '',
        students: []
      },
      selectedStudents: [],
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

  mounted() {
    this.fetchStudents()
  },
  methods: {
    async fetchStudents() {
      try {
        const response = await Network.getAllStudents()
        console.log('This is response: ', response)
        this.data.students = response.data.map((student) => ({ name: student.name }))
      } catch (error) {
        console.error(error)
      }
    },
    selectAll() {
      this.selectedStudents = [...this.data.students]
    },
    clearSelection() {
      this.selectedStudents = []
    },
    selectStudent(student) {
      if (!this.isSelected(student)) {
        this.selectedStudents.push(student)
      } else {
        const index = this.selectedStudents.indexOf(student)
        if (index !== -1) {
          this.selectedStudents.splice(index, 1)
        }
      }
    },
    isSelected(student) {
      return this.selectedStudents.includes(student)
    }
  }
})
</script>

<style src="vue-multiselect/dist/vue-multiselect.css"></style>
