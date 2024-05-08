<template>
  <div class="movable-words">
    <div
      v-for="(word, index) in words"
      :key="index"
      class="draggable"
      :style="{ top: word.top + 'px', left: word.left + 'px' }"
      @mousedown="startDrag(index, $event)"
    >
      {{ word.text }}
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      words: [
        { text: "Word1", top: 100, left: 100 },
        { text: "Word2", top: 150, left: 200 },
        { text: "Word3", top: 200, left: 300 },
        { text: "Word4", top: 250, left: 400 },
      ],
      dragging: false,
      currentWordIndex: -1,
      offsetX: 0,
      offsetY: 0,
    };
  },
  methods: {
    startDrag(index, event) {
      this.dragging = true;
      this.currentWordIndex = index;
      this.offsetX = event.clientX - this.words[index].left;
      this.offsetY = event.clientY - this.words[index].top;
      document.addEventListener("mousemove", this.drag);
      document.addEventListener("mouseup", this.endDrag);
    },
    drag(event) {
      if (this.dragging) {
        this.words[this.currentWordIndex].top = event.clientY - this.offsetY;
        this.words[this.currentWordIndex].left = event.clientX - this.offsetX;
      }
    },
    endDrag() {
      this.dragging = false;
      document.removeEventListener("mousemove", this.drag);
      document.removeEventListener("mouseup", this.endDrag);
    },
  },
};
</script>

<style scoped>
.movable-words {
  position: relative;
  width: 100%;
  height: 100%;
}

.draggable {
  position: absolute;
  cursor: move;
  padding: 5px;
}
</style>
