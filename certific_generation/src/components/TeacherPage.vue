<template>
  <div class="teacher">
    <div class="container">
      <div class="row">
        <div class="col-md-6">
          <div class="teacherContainer">
            <div class="students-container">
              <b-table
                id="students-table"
                :items="students"
                :per-page="perPage"
                :current-page="currentTablePage"
                :fields="fields"
                select-mode="multi"
                responsive="sm"
                ref="selectableTable"
                selectable
                @row-selected="onRowSelected"
                @row-unselected="onRowUnselected"
              >
              </b-table>
              <div class="overflow-auto">
                <b-pagination
                  v-model="currentPage"
                  :total-rows="rows"
                  :per-page="perPage"
                  first-text="First"
                  prev-text="Prev"
                  next-text="Next"
                  last-text="Last"
                  aria-controls="my-table"
                >
                </b-pagination>
              </div>
              <p>
                <b-button size="sm" @click="selectAllRows">Select all</b-button>
                <b-button size="sm" @click="clearSelected"
                  >Clear selected</b-button
                >
              </p>
            </div>
          </div>
        </div>
        <div class="col-md-6">
          <div class="form-wrapper">
            <h2>Введіть дані сертифікату</h2>
            <form @submit.prevent="submitCertForm">
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

<script>
import { defineComponent } from "vue";
import Network from "@/Network";
import { BTable, BButton, BPagination } from "bootstrap-vue-3";

import "vue3-carousel/dist/carousel.css";
export default defineComponent({
  name: "TeacherPage",
  components: {
    BTable,
    BButton,
    BPagination,
  },
  data() {
    return {
      currentPage: 1,
      data: {
        title: "",
        duration: "",
        teacherSurname: "",
      },
      perPage: 5,
      currentTablePage: 1,
      students: [],
      selectedStudents: [],
      fields: ["name"],
    };
  },
  computed: {
    rows() {
      return this.students.length;
    },
  },
  mounted() {
    this.fetchStudents();
  },
  methods: {
    async fetchStudents() {
      try {
        const response = await Network.getAllStudents();
        console.log("This is response: ", response);
        this.students = response.data.map((student) => student);
        console.log("Students ", this.students.length);
        console.log("Students ", this.students);
      } catch (error) {
        console.error("Error fetching students:", error);
      }
    },
    onRowSelected(student) {
      this.selectedStudents.push(student);
      console.log(this.selectedStudents);
    },
    onRowUnselected(student) {
      const index = this.selectedStudents.findIndex(
        (selectedStudent) => selectedStudent.name === student.name
      );
      if (index !== -1) {
        this.selectedStudents.splice(index, 1);
      }
      console.log(this.selectedStudents);
    },
    selectAllRows() {
      this.$refs.selectableTable.selectAllRows();
    },
    clearSelected() {
      this.$refs.selectableTable.clearSelected();
      this.selectedStudents = [];
    },

    async submitCertForm() {
      console.log("Form submitted with data:", this.data);
      try {
        const response = await Network.certificateDate(this.data);
        console.log(response.data);
      } catch (error) {
        console.error(error);
      }
    },
  },
});
</script>

<style>
.btn {
  position: relative;
  margin: 0 0 0 10px;
  background: #ab4c37;
}
</style>
