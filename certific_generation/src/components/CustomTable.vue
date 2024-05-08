<template>
  <div class="certificate-container">
    <div class="movable-words">
      <div
        v-for="(word, index) in words"
        :key="index"
        class="draggable"
        :style="{
          top: word.top + 'px',
          left: word.left + 'px',
          color: word.color,
        }"
        @mousedown="startDrag(index, $event)"
      >
        {{ word.text }}
      </div>
      <div class="input-box button">
        <button @click="pickColorForAllWords">Вибрати колір для всіх</button>
        <ColorPicker
          v-if="colorPickerVisible"
          theme="light"
          :color="color"
          @changeColor="changeColorForAllWords($event)"
          @inputFocus="inputFocus"
          @inputBlur="inputBlur"
        />
      </div>
    </div>
    <div>
      <label for="file-upload" class="input-box button">
        <input
          id="file-upload"
          type="file"
          @change="chooseTemplate"
          style="display: none"
        />
        <span class="custom-button">Вибрати свій</span>
      </label>
    </div>
  </div>
</template>

<script>
import { ColorPicker } from "vue-color-kit";
import "vue-color-kit/dist/vue-color-kit.css";

export default {
  data() {
    return {
      words: [
        { text: "Word1", top: 100, left: 10, color: "#59c7f9" },
        { text: "Word2", top: 150, left: 10, color: "#59c7f9" },
        { text: "Word3", top: 200, left: 10, color: "#59c7f9" },
        { text: "Word4", top: 250, left: 10, color: "#59c7f9" },
      ],
      color: "#59c7f9",
      colorPickerVisible: false,
      dragging: false,
      currentWordIndex: -1,
      offsetX: 0,
      offsetY: 0,
    };
  },
  components: {
    ColorPicker,
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
    pickColorForAllWords() {
      this.colorPickerVisible = !this.colorPickerVisible;
    },
    changeColorForAllWords(color) {
      const { r, g, b, a } = color.rgba;
      const newColor = `rgba(${r}, ${g}, ${b}, ${a})`;
      this.words.forEach((word) => {
        word.color = newColor;
      });
    },
    inputFocus() {
      // Handle input focus if needed
    },
    inputBlur() {
      // Handle input blur if needed
    },
  },
};
</script>

<style scoped>
.certificate-container {
  width: 100%;
  height: 100%;
  margin: auto 0;
}

.target {
  position: absolute;
  top: 100px;
  left: 25px;
  transform-origin: top left;
  word-break: break-all;
  width: auto;
}

.words-conainer {
  position: absolute;
  top: 80px;
  left: 20px;
  width: 300px; /* Ширина прямокутника */
  height: 200px; /* Висота прямокутника */
  border: 2px solid black; /* Рамка прямокутника */
}
.movable-words {
  position: relative;
  width: 100%;
  height: 100%;
  left: 10px; /* Змініть це значення на початкове значення вашого стовпчика */
  top: 10px; /* Змініть це значення на початкове значення вашого стовпчика */
}

.draggable {
  position: absolute;
  cursor: move;
}

.input-box {
  position: absolute;
  top: 10px;
  left: 10px;
}

.button {
  margin-bottom: 10px;
}
</style>
