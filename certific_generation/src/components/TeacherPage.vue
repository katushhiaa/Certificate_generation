<template>
  <div class="teacher">
    <div class="teacherContainer">
      <div class="row">
        <div class="col-md-6">
          <div class="students-container">
            <v-data-table
              ref="selectableTable"
              v-model="selectedStudents"
              :headers="headers"
              :items="students"
              item-value="name"
              select-all
              show-select
              :pagination="true"
              @click:row="onRowSelected"
            ></v-data-table>
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
</template>

<script>
import Network from "@/Network";
export default {
  data() {
    return {
      headers: [
        {
          title: "Студенти",
          align: "start",
          key: "name",
        },
      ],
      students: [],
      data: {
        title: "",
        duration: "",
        teacherSurname: "",
      },
      selectedStudents: [],
    };
  },
  async mounted() {
    await this.fetchStudents();
  },
  methods: {
    async fetchStudents() {
      try {
        this.isBusy = true;
        let response = await Network.getAllStudents();
        this.students = response.data;
      } catch (error) {
        console.error("Error fetching student data:", error);
      } finally {
        this.isBusy = false;
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
};
</script>

<style scoped>
.v-pagination__item .v-icon {
  color: black;
}

@media (min-width: 768px) {
  .col-md-6 {
    flex: 0 0 auto;
    width: 100%;
  }
}
</style>
