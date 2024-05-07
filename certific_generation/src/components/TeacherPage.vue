<template>
  <div>
    <b-table
      id="my-table"
      :busy.sync="isBusy"
      :items="myProvider"
      :fields="fields"
    ></b-table>
  </div>
</template>

<script>
import Network from "@/Network";
import { BTable, BButton, BPagination } from "bootstrap-vue-3";
export default {
  data() {
    return {
      isBusy: false,
      fields: ["name"],
      items: [],
    };
  },
  components: {
    BTable,
    BButton,
    BPagination,
  },
  methods: {
    async myProvider() {
      try {
        this.isBusy = true;
        const response = await Network.getAllStudents();
        const items = response.data;
        this.isBusy = false;
        return items;
      } catch (error) {
        console.error("Error fetching student data:", error);
        this.isBusy = false;
        return [];
      }
    },
  },
};
</script>
