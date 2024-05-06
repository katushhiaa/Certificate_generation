<template>
  <div id="app">
    <navComp />
    <div>
      <div>
        <router-view></router-view>
      </div>
    </div>
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
  background-color: #f3836b !important;
}

.wrapper {
  color: #000000;
}

.form-wrapper {
  position: relative;
  width: 90%;
  background: #fff;
  padding: 34px;
  border-radius: 6px;
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.2);
  height: 90%;
  max-height: 550px;
}

@media screen and (min-width: 768px) {
  .form-wrapper {
    width: 430px;
  }
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
  background: #ab4c37;
  cursor: pointer;
  transition: background 0.3s ease;
}

.input-box.button button:hover {
  background: #ab4c37;
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

.role-selection {
  margin-bottom: 15px;
  color: #000000;
}

.role-selection input[type="radio"] {
  margin: 5px;
}

.text-teacher {
  color: black;
  font-family: "Poppins", sans-serif;
}

.teacherContainer {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  max-width: 800px;
}

.students-container {
  width: auto;
  height: auto;
}

@media screen and (min-width: 768px) {
  .students-container {
    width: 430px;
    padding-right: 50px;
  }
}

@media (max-width: 767px) {
  /* Adjust styles for smaller screens */
  .form-wrapper {
    width: 90%;
  }
}

@media (min-width: 768px) {
  /* Adjust styles for medium and larger screens */
  .form-wrapper {
    width: 430px;
  }
}
</style>
