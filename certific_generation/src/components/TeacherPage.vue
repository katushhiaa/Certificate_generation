<template>
  <div class="teacher">
    <div class="container">
      <div class="row">
        <div class="col-md-6">
          <div class="teacherContainer">
            <div class="students-container">
              <v-data-table
                ref="selectableTable"
                v-model="selectedStudents"
                :headers="headers"
                :items="students"
                item-key="id"
                select-all
                show-select
                :pagination="true"
              ></v-data-table>
              <pre>{{ selectedStudents }}</pre>
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
                <button type="submit" @click="redirectToTemplateChoose">
                  Додати
                </button>
              </div>
            </form>
          </div>
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
        this.students = response.data.map((student) => ({
          id: student._id,
          name: student.name,
        }));
        console.log(this.students);
      } catch (error) {
        console.error("Error fetching student data:", error);
      } finally {
        this.isBusy = false;
      }
    },
    async submitCertForm() {
      console.log("Form submitted with data:", this.data);
      console.log(this.selectedStudents);
      if (localStorage) {
        localStorage.setItem("CertData", JSON.stringify(this.data));
        localStorage.setItem(
          "selectedStudents",
          JSON.stringify(this.selectedStudents)
        );
      }
    },
    redirectToTemplateChoose() {
      this.$router.push("/certificate");
    },
  },
};
</script>

<style scoped></style>
