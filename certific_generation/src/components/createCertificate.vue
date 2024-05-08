<template>
  <div class="certificate-container">
    <div class="words-conainer">
      <div class="moveable-container" :style="{ color: color }">
        <div class="word" ref="word1">Перше</div>
        <Moveable
          className="moveable"
          v-bind:target="['.word']"
          v-bind:draggable="true"
          v-bind:scalable="true"
          v-bind:rotatable="true"
          @drag="onDrag"
          @scale="onScale"
          @rotate="onRotate"
        />
      </div>
      <div class="moveable-container" :style="{ color: color }">
        <div class="word" ref="word2">Друге</div>
        <Moveable
          className="moveable"
          v-bind:target="['.word']"
          v-bind:draggable="true"
          v-bind:scalable="true"
          v-bind:rotatable="true"
          @drag="onDrag"
          @scale="onScale"
          @rotate="onRotate"
        />
      </div>
      <div class="moveable-container" :style="{ color: color }">
        <div class="word" ref="word3">Третє</div>
        <Moveable
          className="moveable"
          v-bind:target="['.word']"
          v-bind:draggable="true"
          v-bind:scalable="true"
          v-bind:rotatable="true"
          @drag="onDrag"
          @scale="onScale"
          @rotate="onRotate"
        />
      </div>
    </div>
    <div class="input-box button">
      <button @click="toggleColorPicker">Виберіть колір</button>
    </div>
    <ColorPicker
      v-if="colorPickerVisible"
      theme="light"
      :color="color"
      :sucker-hide="false"
      :sucker-canvas="suckerCanvas"
      :sucker-area="suckerArea"
      @changeColor="changeColor"
      @inputFocus="inputFocus"
      @inputBlur="inputBlur"
    />
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
import Moveable from "vue3-moveable";
import { ColorPicker } from "vue-color-kit";
import "vue-color-kit/dist/vue-color-kit.css";

export default {
  name: "app",
  components: {
    Moveable,
    ColorPicker,
  },
  data() {
    return {
      color: "#59c7f9",
      suckerCanvas: null,
      suckerArea: [],
      isSucking: false,
      colorPickerVisible: false,
    };
  },
  methods: {
    changeColor(color) {
      const { r, g, b, a } = color.rgba;
      this.color = `rgba(${r}, ${g}, ${b}, ${a})`;
    },
    toggleColorPicker() {
      this.colorPickerVisible = !this.colorPickerVisible;
    },
    onDrag({ transform }) {
      this.$refs.target.style.transform = transform;
    },
    onScale({ drag }) {
      this.$refs.target.style.transform = drag.transform;
    },
    onRotate({ drag }) {
      this.$refs.target.style.transform = drag.transform;
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
</style>
