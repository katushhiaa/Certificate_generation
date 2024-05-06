<template>
  <div class="overflow-auto">
    <b-pagination
      v-model="currentPage"
      :total-rows="rows"
      :per-page="perPage"
      first-text="First"
      prev-text="Prev"
      next-text="Next"
      last-text="Last"
    />
  </div>
</template>

<script>
export default {
  data() {
    return {
      rows: 100,
      perPage: 10,
      currentPage: 1,
    };
  },
};
</script>
