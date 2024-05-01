<template>
  <div class="teacher">
    <div class="container">
      <div class="row">
        <div class="col-md-6">
          <div class="teacherContainer">
            <div class="students-container">
              <b-table
                :items="data.students"
                :fields="fields"
                :select-mode="selectMode"
                responsive="sm"
                ref="selectableTable"
                selectable
                @row-selected="onRowSelected"
              >
                <!--Example scoped slot for select state illustrative purposes -->
                <template #cell(selected)="{ rowSelected }">
                  <template v-if="rowSelected">
                    <span aria-hidden="true">&check;</span>
                    <span class="sr-only">Selected</span>
                  </template>
                  <template v-else>
                    <span aria-hidden="true">&nbsp;</span>
                    <span class="sr-only">Not selected</span>
                  </template>
                </template>
              </b-table>
              <p>
                <b-button size="sm" @click="selectAllRows">Select all</b-button>
                <b-button size="sm" @click="clearSelected">Clear selected</b-button>
              </p>
              <p>
                Selected Rows:<br />
                {{ selectedStudents }}
              </p>
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
//import { BTable, BButton } from 'bootstrap-vue/es/components'

//import { Carousel, Navigation, Pagination, Slide } from 'vue3-carousel'

import 'vue3-carousel/dist/carousel.css'
export default defineComponent({
  name: 'TeacherPage',
  /*components: {
    BTable,
    BButton
  },*/
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
        teacherSurname: ''
      },
      students: [],
      selectedStudents: [],
      fields: ['selected', 'student_name'],
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
        this.students = response.data.map((student) => ({ name: student.name }))
        console.log(this.students)
      } catch (error) {
        console.error(error)
      }
    },
    onRowSelected(students) {
      this.selected = students
    },
    selectAllRows() {
      this.$refs.selectableTable.selectAllRows()
    },
    clearSelected() {
      this.$refs.selectableTable.clearSelected()
    }
  }
})
</script>

<style src="vue-multiselect/dist/vue-multiselect.css"></style>
