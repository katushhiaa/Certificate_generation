<template>
  <div class="wrapper">
    <div class="form-wrapper">
      <h2>Реєстрація</h2>
      <form @submit.prevent="submitForm">
        <v-text-field
          v-model="name"
          :rules="nameRules"
          label="Введіть своє ім'я та прізвище"
          required
        ></v-text-field>
        <v-text-field
          v-model="email"
          :rules="emailRules"
          label="Введіть свою електронну пошту"
          required
        ></v-text-field>
        <v-text-field
          v-model="password"
          :rules="passwordRules"
          label="Створіть пароль"
          type="password"
          required
        ></v-text-field>
        <v-text-field
          v-model="confirmPassword"
          :rules="confirmPasswordRules"
          label="Підтвердіть пароль"
          type="password"
          required
        ></v-text-field>
        <div class="role-selection">
          <input
            type="radio"
            id="teacher"
            v-model="role"
            value="teacher"
            class="form-radio"
          />
          <label for="teacher">Я викладач</label>

          <input
            type="radio"
            id="student"
            v-model="role"
            value="student"
            class="form-radio"
          />
          <label for="student">Я студент</label>
          <div v-if="!roleValid" class="error-message">Роль є обов'язковою</div>
        </div>
        <div class="input-box button">
          <button type="submit">Зареєструватись</button>
        </div>
        <v-snackbar
          v-model="showSnackbar"
          :timeout="snackbarTimeout"
          top
          color="red"
        >
          {{ snackbarMessage }}
          <template v-slot:action="{ attrs }">
            <v-btn
              color="white"
              text
              v-bind="attrs"
              @click="showSnackbar = false"
            >
              Закрити
            </v-btn>
          </template>
        </v-snackbar>
        <div class="text">
          <h3>
            Вже маєте акаунт?
            <router-link to="/login">Увійдіть в нього</router-link>
          </h3>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import Network from "@/Network";
import {
  nameRules,
  emailRules,
  passwordRules,
  confirmPasswordRules,
} from "@/utils/signUpFormRules";

export default {
  name: "RegistrationForm",
  data() {
    return {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "",
      roleValid: true,
      errorMessage: "",
      showSnackbar: false,
      snackbarMessage: "",
      snackbarTimeout: 6000,
      nameRules,
      emailRules,
      passwordRules,
    };
  },
  computed: {
    confirmPasswordRules() {
      return confirmPasswordRules(this.password);
    },
  },
  methods: {
    async submitForm() {
      this.roleValid = !!this.role;
      if (!this.roleValid) {
        return;
      }
      this.errorMessage = "";
      this.showSnackbar = false;
      try {
        const response = await Network.signUp({
          name: this.name,
          email: this.email,
          password: this.password,
          role: this.role,
        });
        const userId = response.data.userId;
        const role = response.data.role;
        const name = this.name;
        localStorage.setItem("userId", userId);
        localStorage.setItem("role", role);
        localStorage.setItem("name", name);
        this.snackbarMessage = "Користувач успішно зареєстрований";
        this.showSnackbar = true;
        if (role === "teacher") {
          this.$router.push("/teacher");
        } else if (role === "student") {
          this.$router.push("/student");
        }
      } catch (error) {
        console.error("Помилка під час реєстрації:", error.response.data);
        if (error.response && error.response.status === 400) {
          this.snackbarMessage = error.response.data.message;
        } else {
          this.snackbarMessage =
            "Сталася помилка. Будь ласка, спробуйте ще раз.";
        }
        this.showSnackbar = true;
      }
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

.error-message {
  color: red;
  margin-top: 10px;
}
</style>
