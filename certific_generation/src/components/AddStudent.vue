<template>
  <div>
    <div class="input-box button" style="margin: 10px; height: 50px">
      <button @click="modalShow = !modalShow">Додати студента</button>
    </div>
    <b-modal v-model="modalShow">
      <form @submit.prevent="submitForm">
        <v-text-field
          v-model="name"
          :rules="nameRules"
          label="Введіть ім'я та прізвище студента"
          required
        ></v-text-field>
        <v-text-field
          v-model="email"
          :rules="emailRules"
          label="Введіть його електронну пошту"
          required
        ></v-text-field>
        <v-text-field
          v-model="password"
          :rules="passwordRules"
          label="Створіть пароль"
          type="password"
          required
        ></v-text-field>
        <v-btn type="submit">Зареєструвати</v-btn>
      </form>
    </b-modal>
  </div>
</template>

<script>
import Network from "../Network";
import { nameRules, emailRules, passwordRules } from "@/utils/signUpFormRules";

export default {
  name: "AddStudent",
  data() {
    return {
      modalShow: false,
      name: "",
      email: "",
      password: "",
      nameRules,
      emailRules,
      passwordRules,
    };
  },
  methods: {
    async submitForm() {
      try {
        const response = await Network.signUp({
          name: this.name,
          email: this.email,
          password: this.password,
          role: "student",
        });
        if (response.status === 201) {
          this.modalShow = false;
        }
      } catch (error) {
        console.error("Error during registration:", error);
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
</style>
