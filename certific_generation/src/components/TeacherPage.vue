<template>
  <div class="teacher">
    <div class="container">
      <div class="row">
        <div class="col-md-6">
          <div class="teacherContainer">
            <div class="students-container">
              <v-text-field
                v-model="searchQuery"
                label="Пошук студентів"
                class="mb-4 custom-search-field"
              ></v-text-field>
              <v-data-table-virtual
                ref="selectableTable"
                v-model="selectedStudents"
                :headers="headers"
                :items="filteredStudents"
                item-key="id"
                select-all
                show-select
                :search="searchQuery"
                @input="updateSelectedStudents"
                class="custom-data-table"
                height="300"
              ></v-data-table-virtual>
              <AddStudent></AddStudent>
            </div>
          </div>
        </div>
        <div class="col-md-6">
          <div class="form-wrapper">
            <h2>Введіть дані сертифікату</h2>
            <v-form ref="certForm" @submit.prevent="submitCertForm">
              <v-text-field
                v-model="data.title"
                :rules="titleRules"
                label="Назва заходу"
                required
              ></v-text-field>
              <v-text-field
                v-model="data.duration"
                :rules="durationRules"
                label="Тривалість (Наприклад: 1 година)"
                required
              ></v-text-field>
              <v-text-field
                v-model="data.teacherSurname"
                :rules="teacherSurnameRules"
                label="Прізвище та ініціали викладача, який проводив захід"
                required
              ></v-text-field>
              <v-text-field
                v-model="data.dateOfGiving"
                :rules="dateOfGivingRules"
                label="Оберіть дату видачі"
                type="date"
                required
              ></v-text-field>
              <div class="input-box button">
                <button type="submit">Додати</button>
              </div>
            </v-form>
          </div>
        </div>
      </div>
    </div>
    <v-snackbar
      v-model="showSnackbar"
      :timeout="snackbarTimeout"
      top
      color="red"
    >
      {{ snackbarMessage }}
      <template v-slot:action="{ attrs }">
        <v-btn color="white" text v-bind="attrs" @click="showSnackbar = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
    <button
      @click="redirectToTemplateChoose"
      :disabled="!isCertDataSaved"
      class="next-button"
    >
      Далі &rarr;
    </button>
  </div>
</template>

<script>
import Network from "@/Network";
import AddStudent from "./AddStudent.vue";
import {
  titleRules,
  durationRules,
  teacherSurnameRules,
  dateOfGivingRules,
} from "@/utils/certificateFormRules";

export default {
  components: {
    AddStudent,
  },
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
        dateOfGiving: "",
      },
      selectedStudents: [],
      errorMessage: "",
      showSnackbar: false,
      snackbarMessage: "",
      snackbarTimeout: 3000,
      titleRules,
      durationRules,
      teacherSurnameRules,
      dateOfGivingRules,
      isCertDataSaved: false,
      searchQuery: "",
    };
  },
  async mounted() {
    await this.fetchStudents();
    this.checkCertDataInLocalStorage();
  },
  computed: {
    filteredStudents() {
      if (!this.searchQuery) {
        return this.students;
      }
      return this.students.filter((student) =>
        student.name.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    },
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
      } catch (error) {
        console.error("Error fetching student data:", error);
      } finally {
        this.isBusy = false;
      }
    },
    checkCertDataInLocalStorage() {
      const certData = localStorage.getItem("CertData");
      const selectedStudents = localStorage.getItem("selectedStudents");
      if (certData) {
        this.data = JSON.parse(certData);
        this.selectedStudents = JSON.parse(selectedStudents);
        this.isCertDataSaved = true;
      }
    },
    updateSelectedStudents() {
      if (localStorage) {
        localStorage.setItem(
          "selectedStudents",
          JSON.stringify(this.selectedStudents)
        );
      }
    },
    async submitCertForm() {
      const form = this.$refs.certForm;
      if (form && form.validate() && this.selectedStudents.length > 0) {
        if (localStorage) {
          localStorage.setItem("CertData", JSON.stringify(this.data));
          localStorage.setItem(
            "selectedStudents",
            JSON.stringify(this.selectedStudents)
          );
        }
        this.isCertDataSaved = true;
        this.redirectToTemplateChoose();
      } else {
        this.errorMessage =
          "Форма не повинна відправлятись пустою, і повинен бути хоча б один обраний студент";
        this.snackbarMessage =
          "Форма не повинна відправлятись пустою, і повинен бути хоча б один обраний студент";
        this.showSnackbar = true;
      }
    },
    redirectToTemplateChoose() {
      this.$router.push("/certificate");
    },
  },
};
</script>

<style scoped>
:deep(
    .v-input--density-default
      .v-field--variant-solo
      .v-label.v-field-label--floating
  ),
:deep(
    .v-input--density-default
      .v-field--variant-solo-inverted
      .v-label.v-field-label--floating
  ),
:deep(
    .v-input--density-default
      .v-field--variant-filled
      .v-label.v-field-label--floating
  ),
:deep(
    .v-input--density-default
      .v-field--variant-solo-filled
      .v-label.v-field-label--floating
  ) {
  top: -2px !important;
}

.v-selection-control-group {
  display: flex;
  flex-direction: row;
  justify-content: center !important;
}

.next-button {
  position: absolute;
  top: 70px;
  right: 10px;
  padding: 10px 20px;
  color: #fff;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  border: none;
}

.custom-search-field >>> .v-input__control {
  background-color: #f5f5f5 !important;
}

@media (max-width: 767px) {
  .next-button {
    top: 50px;
  }
}
</style>
