<template>
  <div class="page-container">
    <form
      method="POST"
      enctype="multipart/form-data"
      @submit.prevent="saveTemplate"
    >
      <div class="certificate-container">
        <div class="input-box" style="top: 280px">
          <div>
            <label for="file-upload" class="input-box button">
              <v-file-input outlined label="File" v-model="image" />
            </label>
          </div>

          <button @click="pickColorForAllWords" class="custom-button">
            Вибрати колір слів
          </button>

          <ColorPicker
            v-if="colorPickerVisible"
            theme="light"
            :color="color"
            @changeColor="changeColorForAllWords($event)"
            @inputFocus="inputFocus"
            @inputBlur="inputBlur"
            style="width: 220px; height: 300px"
          />

          <div class="save-button">
            <button type="submit">Зберегти</button>
          </div>
        </div>
        <div class="default-word-position"></div>
        <div class="template-container">
          <img v-if="base64" :src="base64" alt="Template Image" />
          <div class="movable-words">
            <div
              v-for="(word, index) in words"
              :key="index"
              class="draggable"
              :style="{
                position: 'absolute',
                top: word.top + 'px',
                left: word.left + 'px',
                color: word.color,
                'font-size': word.font + 'px',
              }"
              @mousedown="startDrag(index, $event)"
            >
              {{ word.text }}
            </div>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import { ColorPicker } from "vue-color-kit";
import "vue-color-kit/dist/vue-color-kit.css";
import Network from "@/Network";
import axios from "axios";

export default {
  data() {
    return {
      image: null,
      base64: null,
      words: [
        { text: "Student", top: 0, left: -230, color: "#000000", font: 18 },
        {
          text: "Event",
          top: 24,
          left: -230,
          color: "#000000",
          font: 24,
        },
        { text: "Teacher", top: 60, left: -230, color: "#000000", font: 18 },
        { text: "Duration", top: 90, left: -230, color: "#000000", font: 18 },
        { text: "Date", top: 120, left: -230, color: "#000000", font: 18 },
      ],
      color: "#000000",
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
  watch: {
    image: function (newVal, oldVal) {
      if (newVal) {
        this.createBase64Image(newVal);
      } else {
        this.base64 = null;
      }
    },
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
    createBase64Image: function (FileObject) {
      const reader = new FileReader();
      reader.onload = (event) => {
        this.base64 = event.target.result;
      };
      reader.readAsDataURL(FileObject);
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
    async saveTemplate() {
      const userId = localStorage.getItem("userId");
      console.log("Координати з кольорами всіх полів:");
      this.words.forEach((word) => {
        console.log(
          `${word.text} - Координати: (${word.top}, ${word.left}), Колір: ${word.color}`
        );
      });
      const response = await Network.saveTemplateData({
        studentName_color: this.words[0].color,
        studentName_top: this.words[0].top,
        studentName_left: this.words[0].left,
        title_color: this.words[1].color,
        title_top: this.words[1].top,
        title_left: this.words[1].left,
        teacherSurname_color: this.words[2].color,
        teacherSurname_top: this.words[2].top,
        teacherSurname_left: this.words[2].left,
        duration_color: this.words[3].color,
        duration_top: this.words[3].top,
        duration_left: this.words[3].left,
        dateOfGiving_color: this.words[4].color,
        dateOfGiving_top: this.words[4].top,
        dateOfGiving_left: this.words[4].left,
        image: this.base64,
        createdBy: userId,
      });

      console.log(response.data);
      alert("Saved sucssesfully");
      this.$router.push("/certificate");
    },
  },
};
</script>
<style scoped>
.page-container {
  margin: 60px auto;
  width: 90vw;
}

.certificate-container {
  display: flex;
  justify-content: space-between;
  flex-direction: row;
}

.template-container {
  position: relative;
  user-select: none;
  width: 900px;
  height: 400px;
}

.template-container img {
  width: 900px;
  height: 400px;
  position: relative;
  z-index: 1;
  border: 1px solid black;
}

.movable-words {
  position: absolute;
  text-align: center;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
}

.draggable {
  position: absolute;
  cursor: move;
}

.default-word-position {
  width: 200px;
  background: #cccccc54;
}

.input-box {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-direction: column;
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

.draggable {
  position: absolute;
  cursor: move;
  z-index: 2;
}

.save-button {
  margin: 100px 0 0;
  display: inline-block;
  padding: 10px 20px;
  background-color: #ab4c37;
  color: #fff;
  border-radius: 5px;
  font-size: 16px;
  transition: background-color 0.3s ease;
}
</style>
