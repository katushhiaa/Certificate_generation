<template>
<div class="wrapper">
  <h2>Введіть дані сертифікату</h2>
  <form @submit.prevent="generateCertificate">
    <div class="input-box">
      <input v-model="formData.title" type="text" id="title" required placeholder="Назва заходу (участь в)">
    </div>
    <div class="input-box">
      <input v-model="formData.duration" type="text" id="duration" required placeholder="Тривалість (Наприклад: 1 година)">
    </div>
    <div class="input-box">
      <input v-model="formData.teacherSurname" type="text" id="surname-teacher" required placeholder="Прізвище та ініціали викладача, який проводив захід">
    </div>
    <div class="input-box">
      <input v-model="formData.studentCount" type="number" min="1" id="students-count" required placeholder="Кількість студентів">
    </div>
    <div class="input-box">
      <input v-model="formData.studentSurname" type="text" id="surname-student" required placeholder="Прізвища та ініціали для кожного студента">
    </div>
    <div class="input-box button">
      <button type="submit">Додати</button>
    </div>
  </form>
</div>

          <!--<div class="col-md-6 mb-6">
            <h2 class="card-title text-white">Оберіть шаблон</h2>
            <div class="content">
              <div class="slider single-item" @click="chooseTemplate">
                <div v-for="(template, index) in templates" :key="index">
                  <div class="image">
                    <img :src="template.image" :data-src="template.image" :data-class="template.class"/>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div id="temp" class="hidden">
        <div class="template" style="font-family: Roboto;">
          <div class="selected-image"></div>
          <div class="student-temp"></div>
          <div class="title-temp"></div>
          <div class="teacher-temp"></div>
          <div class="date-temp"></div>
          <div class="duration-temp"></div>
        </div>-->
  </template>
  
  <script>
  export default {
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
      };
    },
    methods: {
      generateCertificate() {
        // your function to generate certificate
      },
      chooseTemplate() {
        // your function to choose template
      },
      printCertificate() {
        // your function to print certificate
      },
      downloadCertificate() {
        // your function to download certificate as PDF
      }
    }
  };
  </script>
  
  <style>
  
 </style> 