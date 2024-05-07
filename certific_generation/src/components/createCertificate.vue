<template>
  <div class="container" :style="{ color: color }">
    <div class="target" ref="target">Vue Moveable</div>
    <Moveable
      className="moveable"
      v-bind:target="['.target']"
      v-bind:draggable="true"
      v-bind:scalable="true"
      v-bind:rotatable="true"
      @drag="onDrag"
      @scale="onScale"
      @rotate="onRotate"
    />
    <ColorPicker
      theme="light"
      :color="color"
      :sucker-hide="false"
      :sucker-canvas="suckerCanvas"
      :sucker-area="suckerArea"
      @changeColor="changeColor"
      @openSucker="openSucker"
      @inputFocus="inputFocus"
      @inputBlur="inputBlur"
    />
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
    };
  },
  methods: {
    changeColor(color) {
      const { r, g, b, a } = color.rgba;
      this.color = `rgba(${r}, ${g}, ${b}, ${a})`;
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
