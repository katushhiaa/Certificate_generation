<template>
  <div id="app" class="main-container">
    <navComp />
    <router-view></router-view>
    <footerComp />
  </div>
</template>

<script>
import navComp from "./components/NavComp.vue";
import footerComp from "./components/FooterComp.vue";

export default {
  name: "App",
  components: {
    navComp,
    footerComp,
  },
};
</script>

<style>
@import url("https://fonts.googleapis.com/css?family=Poppins:400,500,600,700&display=swap");
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: "Poppins", sans-serif;
}

body {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #7092aa !important;
}

.wrapper {
  color: #000000;
}

.form-wrapper {
  position: relative;
  background: #fff;
  padding: 34px;
  border-radius: 6px;
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 430px;
  margin: 75px;
}

.form-wrapper h2 {
  position: relative;
  font-size: 22px;
  font-weight: 600;
  color: #333;
}
.form-wrapper h2::before {
  content: "";
  position: absolute;
  left: 0;
  bottom: 0;
  height: 3px;
  width: 28px;
  border-radius: 12px;
  background: #f3836b;
}
.form-wrapper form {
  margin-top: 30px;
}
.form-wrapper form .input-box {
  height: 52px;
  margin: 18px 0;
}
form .input-box input {
  height: 100%;
  width: 100%;
  outline: none;
  padding: 0 15px;
  font-size: 17px;
  font-weight: 400;
  color: #333;
  border: 1.5px solid #c7bebe;
  border-bottom-width: 2.5px;
  border-radius: 6px;
  transition: all 0.3s ease;
}
.input-box input:focus,
.input-box input:valid {
  border-color: #f3836b;
}
form h3 {
  color: #707070;
  font-size: 14px;
  font-weight: 500;
  margin-left: 10px;
}
.input-box.button input {
  color: #fff;
  letter-spacing: 1px;
  border: none;
  background: #ab4c37;
  cursor: pointer;
}
.input-box.button input:hover {
  background: #ab4c37;
}

.input-box.button button {
  height: 100%;
  width: 100%;
  outline: none;
  padding: 0 15px;
  font-size: 17px;
  font-weight: 600;
  color: #fff;
  border: none;
  border-radius: 6px;
  background: #575b6b;
  cursor: pointer;
  transition: background 0.3s ease;
}

form .text h3 {
  color: #333;
  width: 100%;
  text-align: center;
}

form .text h3 a {
  color: #4070f4;
  text-decoration: none;
}
form .text h3 a:hover {
  text-decoration: underline;
}

label {
  padding: 8px 0;
}

.teacherContainer {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.students-container {
  width: 100%;
  max-width: 430px;
  margin: 75px;
}

.form-radio {
  margin-left: 10px;
}

.carousel-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  margin: 0 auto;
}
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

.error-message {
  color: red;
  font-size: 0.9em;
  margin-top: 0.5em;
}

@media (max-width: 767px) {
  .form-wrapper {
    width: 90%;
    padding: 20px;
    margin: 75px 20px;
  }
  .students-container {
    width: 100%;
    padding: 0 20px;
    margin: 20px auto;
  }
  .teacherContainer {
    flex-direction: column;
  }
  .form-radio {
    margin-left: 10px;
  }
  .final_wrapper .carousel-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    margin: 0;
  }

  .input-box {
    flex-direction: column;
  }
  .main-container .final_wrapper {
    display: block;
  }

  body {
    align-items: center;
    justify-content: flex-start;
    flex-direction: column;
    padding-top: 90px;
  }

  .button-box {
    background-color: #7092aa;
  }

  .button-container button {
    margin: 5px 0;
  }
  .default-word-position {
    background-color: #fff;
  }
  .template-container {
    position: relative;
    user-select: none;
    width: 900px;
    height: 400px;
  }
}
</style>
