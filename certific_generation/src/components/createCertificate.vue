<template>
  <div class="page-container">
    <form
      method="POST"
      enctype="multipart/form-data"
      @submit.prevent="saveTemplate"
    >
      <div class="certificate-container">
        <div class="button-box" style="top: 280px">
          <div>
            <label for="file-upload" class="button-box button">
              <v-file-input
                outlined
                label="File"
                v-model="image"
                variant="solo-inverted"
                class="file-input"
              />
            </label>
          </div>

          <button
            type="button"
            @click.prevent="pickColorForAllWords"
            class="custom-button"
          >
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

          <div v-if="isDesctop" class="save-button">
            <button type="submit">Зберегти</button>
          </div>
        </div>

        <div class="center-text outer">Центрувати:</div>
        <div class="checkbox-container">
          <div class="center-text">Центрувати:</div>
          <label class="custom-checkbox">
            <input type="checkbox" v-model="title_is_centred" />
            <span class="checkbox-label">Подія</span>
          </label>
          <label class="custom-checkbox">
            <input type="checkbox" v-model="duration_is_centred" />
            <span class="checkbox-label">Тривалість</span>
          </label>
          <label class="custom-checkbox">
            <input type="checkbox" v-model="teacherName_is_centred" />
            <span class="checkbox-label">Викладач</span>
          </label>
          <label class="custom-checkbox">
            <input type="checkbox" v-model="studentName_is_centred" />
            <span class="checkbox-label">Студент</span>
          </label>
          <label class="custom-checkbox">
            <input type="checkbox" v-model="date_is_centered" />
            <span class="checkbox-label">Дата</span>
          </label>
        </div>
        <div class="default-word-position"></div>
        <div class="template-container">
          <img
            v-if="base64"
            :src="base64"
            alt="Template Image"
            ref="templateImage"
          />
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
              @touchstart="startDrag(index, $event)"
            >
              {{ word.text }}
            </div>
          </div>
        </div>
        <div v-if="!isDesctop" class="save-button">
          <button type="submit">Зберегти</button>
        </div>
        <button type="button" @click="goBack" class="back-button">
          ← Назад
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import { ColorPicker } from "vue-color-kit";
import "vue-color-kit/dist/vue-color-kit.css";
import Network from "@/Network";

export default {
  data() {
    return {
      image: null,
      base64: null,
      wordsLarge: [
        { text: "Студент", top: 0, left: -170, color: "#000000", font: 18 },
        { text: "Подія", top: 24, left: -170, color: "#000000", font: 24 },
        { text: "Викладач", top: 60, left: -170, color: "#000000", font: 18 },
        { text: "Тривалість", top: 90, left: -170, color: "#000000", font: 18 },
        { text: "Дата", top: 120, left: -170, color: "#000000", font: 18 },
      ],
      wordsSmall: [
        { text: "Студент", top: -50, left: 10, color: "#000000", font: 10 },
        { text: "Подія", top: -55, left: 95, color: "#000000", font: 13 },
        { text: "Викладач", top: -50, left: 170, color: "#000000", font: 10 },
        { text: "Тривалість", top: -50, left: 255, color: "#000000", font: 10 },
        { text: "Дата", top: -50, left: 345, color: "#000000", font: 10 },
      ],
      words: [],
      color: "#000000",
      colorPickerVisible: false,
      dragging: false,
      currentWordIndex: -1,
      offsetX: 0,
      offsetY: 0,
      isDesctop: false,
      title_is_centred: false,
      duration_is_centred: false,
      teacherName_is_centred: false,
      studentName_is_centred: false,
      date_is_centered: false,
      widthScaleImage: 0,
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
  mounted() {
    window.addEventListener("resize", this.handleResize);
    this.handleResize();
    this.getScaledImageWidth();
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.handleResize);
  },
  methods: {
    getScaledImageWidth() {
      const imageElement = this.$refs.templateImage;
      console.log(imageElement);
      if (imageElement) {
        this.widthScaleImage = imageElement.offsetWidth;
        console.log("Image Width: ", this.widthScaleImage);
      }
    },
    startDrag(index, event) {
      this.dragging = true;
      this.currentWordIndex = index;
      if (event.type === "mousedown") {
        this.offsetX = event.clientX - this.words[index].left;
        this.offsetY = event.clientY - this.words[index].top;
        document.addEventListener("mousemove", this.drag);
        document.addEventListener("mouseup", this.endDrag);
      } else if (event.type === "touchstart") {
        const touch = event.touches[0];
        this.offsetX = touch.clientX - this.words[index].left;
        this.offsetY = touch.clientY - this.words[index].top;
        document.addEventListener("touchmove", this.drag);
        document.addEventListener("touchend", this.endDrag);
      }
    },
    createBase64Image: function (FileObject) {
      const reader = new FileReader();
      reader.onload = (event) => {
        this.base64 = event.target.result;
        const image = new Image();
        image.onload = () => {
          this.imageWidth = image.width;
          console.log(this.imageWidth);
          this.imageHeight = image.height;
          console.log(this.imageHeight);
        };
        image.src = event.target.result;
      };
      reader.readAsDataURL(FileObject);
    },
    drag(event) {
      if (this.dragging) {
        if (event.type === "mousemove") {
          this.words[this.currentWordIndex].top = event.clientY - this.offsetY;
          this.words[this.currentWordIndex].left = event.clientX - this.offsetX;
        } else if (event.type === "touchmove") {
          const touch = event.touches[0];
          this.words[this.currentWordIndex].top = touch.clientY - this.offsetY;
          this.words[this.currentWordIndex].left = touch.clientX - this.offsetX;
          console.log(
            "Top: ",
            (this.words[this.currentWordIndex].top =
              touch.clientY - this.offsetY)
          );
          console.log(
            "Left: ",
            (this.words[this.currentWordIndex].left =
              touch.clientX - this.offsetX)
          );
        }
        this.words[this.currentWordIndex].width = event.target.offsetWidth;
      }
    },
    endDrag(event) {
      this.dragging = false;
      if (event.type === "mouseup") {
        document.removeEventListener("mousemove", this.drag);
        document.removeEventListener("mouseup", this.endDrag);
      } else if (event.type === "touchend") {
        document.removeEventListener("touchmove", this.drag);
        document.removeEventListener("touchend", this.endDrag);
      }
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
      this.getScaledImageWidth();
      const userId = localStorage.getItem("userId");
      console.log(window.innerWidth);
      const scaleFactor = this.imageWidth / this.widthScaleImage;
      console.log("coeffff", scaleFactor);
      console.log(this.imageWidth, window.innerWidth);

      const adjustedWords = this.words.map((word) => ({
        ...word,
        top: word.top * scaleFactor,
        left: word.left * scaleFactor,
      }));

      console.log("Координати з кольорами всіх полів:", adjustedWords);

      //return;
      const response = await Network.saveTemplateData({
        studentName_color: adjustedWords[0].color,
        studentName_top: adjustedWords[0].top,
        studentName_left:
          adjustedWords[0].left +
          (this.studentName_is_centred
            ? (adjustedWords[0].width / 2) * scaleFactor
            : 0),
        title_color: adjustedWords[1].color,
        title_top: adjustedWords[1].top,
        title_left:
          adjustedWords[1].left +
          (this.title_is_centred
            ? (adjustedWords[1].width / 2) * scaleFactor
            : 0),
        teacherSurname_color: adjustedWords[2].color,
        teacherSurname_top: adjustedWords[2].top,
        teacherSurname_left:
          adjustedWords[2].left +
          (this.teacherName_is_centred
            ? (adjustedWords[2].width / 2) * scaleFactor
            : 0),
        duration_color: adjustedWords[3].color,
        duration_top: adjustedWords[3].top,
        duration_left:
          adjustedWords[3].left +
          (this.duration_is_centred
            ? (adjustedWords[3].width / 2) * scaleFactor
            : 0),
        dateOfGiving_color: adjustedWords[4].color,
        dateOfGiving_top: adjustedWords[4].top,
        dateOfGiving_left:
          adjustedWords[4].left +
          (this.date_is_centered
            ? (adjustedWords[4].width / 2) * scaleFactor
            : 0),
        image: this.base64,
        imageWidth: this.imageWidth,
        imageHeight: this.imageHeight,
        createdBy: userId,
        title_is_centred: this.title_is_centred,
        duration_is_centred: this.duration_is_centred,
        teacherName_is_centred: this.teacherName_is_centred,
        studentName_is_centred: this.studentName_is_centred,
        date_is_centered: this.date_is_centered,
      });

      console.log(response.data);
      alert("Saved successfully");
      this.$router.push("/certificate");
    },

    handleResize() {
      if (window.innerWidth < window.innerHeight) {
        this.words = this.wordsSmall;
        this.isDesctop = false;
      } else {
        this.words = this.wordsLarge;
        this.isDesctop = true;
      }
    },
    goBack() {
      this.$router.back();
    },
  },
};
</script>

<style>
.file-input .v-field {
  min-width: 130px;
}
</style>

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
  height: auto;
}

.template-container img {
  width: 900px;
  height: auto;
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

.button-box {
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
  cursor: pointer;
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

.v-field.v-field--appended {
  --v-field-padding-end: 6px;
  background-color: antiquewhite;
  width: 180px;
}

.checkbox-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin: 10px;
  background: #cccccc54;
  padding: 10px;
}

.custom-checkbox {
  display: flex;
  align-items: center;
  gap: 10px;
}

.custom-checkbox input {
  width: 20px;
  height: 20px;
  margin: 0;
  cursor: pointer;
}

.checkbox-label {
  font-size: 16px;
  color: #333;
  cursor: pointer;
}

.back-button {
  position: absolute;
  top: 70px;
  left: 10px;
  padding: 10px 20px;
  color: #fff;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  border: none;
}

.center-text {
  font-size: 18px;
  font-weight: bold;
  color: #000000;
  margin-bottom: 10px;
  background: none;
}

.center-text.outer {
  display: none;
}

@media (max-width: 767px) {
  .page-container {
    margin: 0;
    width: 100vw;
  }

  .certificate-container {
    justify-content: flex-start;
    flex-direction: column;
  }

  .button-box {
    justify-content: space-evenly;
    align-items: center;
    flex-direction: row;
  }

  .default-word-position {
    width: 100vw;
    height: 60px;
  }

  .template-container {
    width: 100vw;
    height: 50vw;
  }

  .template-container img {
    width: 100vw;
  }

  .save-button {
    width: 70vw;
    text-align: center;
    margin: 50px auto 0;
  }

  .checkbox-container {
    display: flex;
    flex-direction: row;
    margin: 10px 0;
  }
  .custom-checkbox input {
    width: 10px;
    height: 10px;
    margin: 0;
    cursor: pointer;
  }
  .checkbox-label {
    font-size: 13px;
    color: #333;
    cursor: pointer;
  }

  .back-button {
    top: 55px;
    left: -7px;
  }

  .center-text {
    font-size: 15px;
    font-weight: bold;
    color: #000000;
    margin-bottom: 10px;
    background: none;
    display: none;
    margin-left: 10px;
  }

  .center-text.outer {
    display: block;
  }

  .v-field.v-field--appended {
    --v-field-padding-end: 6px;
    background-color: antiquewhite;
    width: 180px;
  }
}
</style>
