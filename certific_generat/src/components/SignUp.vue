<template>
  <div class="wrapper">
    <div class="form-wrapper">
      <h2>Реєстрація</h2>
      <form @submit.prevent="submitForm">
        <div class="input-box">
          <input type="text" v-model="name" placeholder="Введіть свій логін" required />
        </div>
        <div class="input-box">
          <input
            type="email"
            v-model="email"
            placeholder="Введіть свою електронну пошту"
            required
          />
        </div>
        <div class="input-box">
          <input type="password" v-model="password" placeholder="Створіть пароль" required />
        </div>
        <div class="input-box">
          <input
            type="password"
            v-model="confirmPassword"
            placeholder="Підвердіть пароль"
            required
          />
        </div>
        <div class="role-selection">
          <input type="radio" id="teacher" v-model="role" value="teacher" class="form-radio" />
          <label for="teacher"> Я викладач</label>

          <input type="radio" id="student" v-model="role" value="student" class="text" />
          <label for="student">Я студент</label>
        </div>
        <div class="input-box button">
          <button type="submit">Зареєструватись</button>
        </div>
        <div class="text">
          <h3>Вже маєте акаунт?<a href="#" @click="redirectToLogin">Увійдіть в нього</a></h3>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import Network from '@/Network'

export default {
  name: 'RegistrationForm',
  data() {
    return {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: ''
    }
  },
  methods: {
    async submitForm() {
      console.log('Form submitted with data:', {
        name: this.name,
        email: this.email,
        password: this.password,
        role: this.role
      })

      try {
        const response = await Network.signUp({
          name: this.name,
          email: this.email,
          password: this.password,
          role: this.role
        })
        console.log(response.data)
      } catch (error) {
        console.error(error.response.data)
      }
    }
  }
}
</script>
