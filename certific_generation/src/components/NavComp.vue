<template>
  <b-navbar
    toggleable="lg"
    type="dark"
    variant="info"
    class="fixed-top"
    style="background-color: rgb(146 164 178) !important"
  >
    <b-navbar-brand>Генератор сертифікатів</b-navbar-brand>

    <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

    <b-collapse id="nav-collapse" is-nav>
      <b-navbar-nav class="ml-auto">
        <b-nav-item-dropdown right>
          <template #button-content>
            <user-icon></user-icon>
          </template>
          <template v-if="isAuthenticated">
            <b-dropdown-item disabled>{{ userName }}</b-dropdown-item>
            <b-dropdown-item @click="logout">Вийти</b-dropdown-item>
          </template>
          <template v-else>
            <b-dropdown-item @click="goToLogin">Увійти</b-dropdown-item>
            <b-dropdown-item @click="goToSignUp"
              >Зареєструватись</b-dropdown-item
            >
          </template>
        </b-nav-item-dropdown>
      </b-navbar-nav>
    </b-collapse>
  </b-navbar>
</template>

<script>
import {
  BNavbar,
  BNavbarNav,
  BNavItemDropdown,
  BDropdownItem,
} from "bootstrap-vue-3";
import UserIcon from "./UserIcon.vue";

export default {
  name: "navComp",
  components: {
    BNavbar,
    BNavbarNav,
    BNavItemDropdown,
    BDropdownItem,
    UserIcon,
  },
  data() {
    return {
      isAuthenticated: false,
      userName: "",
    };
  },
  mounted() {
    this.checkAuthentication();
  },
  methods: {
    checkAuthentication() {
      const userId = localStorage.getItem("userId");
      const role = localStorage.getItem("role");
      const name = localStorage.getItem("name");

      if (userId && role && name) {
        this.isAuthenticated = true;
        this.userName = name;
      } else {
        this.isAuthenticated = false;
      }
    },
    goToLogin() {
      this.$router.push("/login");
    },
    goToSignUp() {
      this.$router.push("/signup");
    },
    logout() {
      localStorage.removeItem("userId");
      localStorage.removeItem("role");
      localStorage.removeItem("name");
      this.isAuthenticated = false;
      this.$router.push("/login");
    },
  },
  watch: {
    $route() {
      this.checkAuthentication();
    },
  },
};
</script>

<style>
.navbar {
  background-color: #f8f9fa !important;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
}
</style>
