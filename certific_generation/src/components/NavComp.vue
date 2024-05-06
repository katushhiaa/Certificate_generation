<template>
  <b-navbar toggleable="lg" type="dark" variant="info" class="fixed-top">
    <b-navbar-brand>Генератор сертифікатів</b-navbar-brand>

    <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

    <b-collapse id="nav-collapse" is-nav>
      <b-navbar-nav>
        <b-nav-item href="#">Контакти</b-nav-item>
        <b-nav-item href="#">Інструкція з використання</b-nav-item>
      </b-navbar-nav>
    </b-collapse>
  </b-navbar>
</template>

<script>
import { BNavbar } from "bootstrap-vue-3";
export default {
  name: "navComp",
  components: {
    BNavbar,
  },
};
</script>

<style>
.navbar {
  background-color: #f8f9fa !important;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
}

p {
  margin-bottom: 0px;
}
</style>
