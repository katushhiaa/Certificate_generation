<template>
  <div v-if="certificates.length > 0">
    <p v-for="(certificate, index) in certificates" :key="index">
      {{ certificate }}
    </p>
  </div>
  <div v-else>
    <p>Loading...</p>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import Network from "@/Network";
export default defineComponent({
  name: "CreateCertificate",
  data() {
    return {
      certificates: [],
    };
  },
  mounted() {
    this.fetchCertificates();
  },
  methods: {
    async fetchCertificates() {
      try {
        const response = await Network.getCertData();
        console.log("This is response: ", response);
        this.certificates = response.data.map((certificate) => certificate);
        console.log("Certificates ", this.certificates.length);
        console.log("Certificates ", this.certificates);
      } catch (error) {
        console.error("Error fetching certificates:", error);
      }
    },
  },
});
</script>
