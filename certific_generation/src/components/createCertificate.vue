<template>
  <div class="page-container">
    <div class="certificate-container">
      <div class="words-container">
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
        </div>
        <div class="input-box button">
          <button @click="pickColorForAllWords" class="custom-button">
            Вибрати колір для всіх
          </button>
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
      <div class="template-container">
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
    inputFocus() {},
    inputBlur() {},
  },
};
</script>
<style scoped>
.page-container {
  width: 100%;
  height: 100%;
  margin: auto 0;
}
.page-container {
  width: 100%;
  height: 100%;
  margin: auto 0;
}

.certificate-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.template-container {
  position: absolute;
  top: 0;
  right: 0;
  width: 75%;
  height: 100%;
}

.words-container {
  position: relative;
  width: 300px;
  height: 350px;
  border: 2px solid black;
}

.movable-words {
  position: relative;
  width: 100%;
  height: 100%;
}

.draggable {
  position: absolute;
  cursor: move;
}

.input-box {
  position: absolute;
  bottom: 10px;
  left: 10px;
}

.button {
  margin-bottom: 10px;
}

.custom-button {
  display: inline-block;
  padding: 10px 20px;
  background-color: #ab4c37;
  color: #fff;
  border-radius: 5px;
  font-size: 16px;
  transition: background-color 0.3s ease;
}

.input-box.button button {
  height: 50px;
  width: 250px;
}
</style>
