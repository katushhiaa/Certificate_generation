<template>
    <form @submit.prevent="submitForm">
        <h3>Sign up</h3>

        <div class="form-group">
            <label>Логін</label>
            <input type="text"  class="form-control" v-model="login" placeholder="Login"/>

            <label>Електронна пошта</label>
            <input type="email"  class="form-control" v-model="email" placeholder="Email"/>

            <label>Пароль</label>
            <input type="password"  class="form-control" v-model="password" placeholder="Password"/>

            <label>Підтвердіть пароль</label>
            <input type="password"  class="form-control" v-model="password_confirmed" placeholder="Confirm password"/>

            <label>Я викладач</label>
            <input type="checkbox" class="form-checkbox" v-model="isTeacher" placeholder="I am teacher"/>

            <label>Я учень</label>
            <input type="checkbox" class="form-checkbox" v-model="isStudent" placeholder="I am studen"/>
        </div>

        <button class="btn btn-primary btn-block">Sign Up</button>

    </form>
</template>

<script>

    export default{
        name: 'SignUp',
        data(){
            return {
                first_name: '',
                last_name: '',
                email: '',
                password: '',
                password_confirmed: ''
            }
        },

        methods: {
            submitForm() {
                console.log('Form submitted with data:', {
                    first_name: this.login,
                    email: this.email,
                    password: this.password,
                    password_confirmed: this.password_confirmed,
                    isTeacher: this.isTeacher,
                    isStudent: this.isStudent
                });
            }
        }
    }
</script>
