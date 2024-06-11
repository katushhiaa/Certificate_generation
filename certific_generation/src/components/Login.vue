<template>
  <div class="wrapper">
    <div class="form-wrapper">
      <h2>Увійти</h2>
      <form name="login-form" @submit.prevent="submitLogin">
        <div class="auth-inner">
          <div class="input-box">
            <input
              type="text"
              v-model="email"
              placeholder="Введіть свою електронну пошту"
              required
            />
          </div>

          <div class="input-box">
            <input
              type="password"
              v-model="password"
              placeholder="Введіть пароль"
              required
            />
          </div>
        </div>

        <div class="input-box button">
          <button type="submit">Увійти</button>
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
            Не маєте акаунт?
            <router-link to="/signup">Зареєструватись</router-link>
          </h3>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import Network from "../Network";
export default {
  name: "loginComp",
  data() {
    return {
      email: "",
      password: "",
      errorMessage: "",
      showSnackbar: false,
      snackbarMessage: "",
      snackbarTimeout: 6000,
    };
  },
  methods: {
    async submitLogin() {
      this.errorMessage = "";
      this.showSnackbar = false;
      try {
        const response = await Network.login({
          email: this.email,
          password: this.password,
        });
        const userId = response.data.userId;
        const role = response.data.role;
        const name = response.data.name;
        const accessToken = response.data.accessToken;

        localStorage.setItem("userId", userId);
        localStorage.setItem("role", role);
        localStorage.setItem("name", name);
        localStorage.setItem("user", JSON.stringify({ accessToken }));

        if (role === "teacher") {
          this.$router.push("/teacher");
        } else if (role === "student") {
          this.$router.push("/student");
        }
      } catch (error) {
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
