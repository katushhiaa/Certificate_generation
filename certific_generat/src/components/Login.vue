<template>
    <div class="wrapper">
        <h2>Увійти</h2>
        <form name="login-form" @submit.prevent="submitLogin">
            <div class="auth-inner">
                <div class="input-box">
                    <input type="text" v-model="name" placeholder="Введіть свій логін" required>
                </div>

                <div class="input-box">
                    <input type="password" v-model="password" placeholder="Введіть пароль" required>
                </div>

                <div class="role-selection">
                    <input type="radio" id="teacher" v-model="role" value="teacher" class="form-radio"/>
                    <label for="teacher"> Я викладач</label>
            
                    <input type="radio" id="student" v-model="role" value="student" class="text"/>
                    <label for="student">Я студент</label>
                </div>
            </div>

            <div class="input-box button">
                <button type="submit">Увійти</button>
            </div>
            <div class="text">
                    <h3>Не маєте акаунт?<a href="#" @click="redirectToSignUp">Зареєструватись</a></h3>
                </div>
        </form>
    </div>
</template>

<script>
    export default {
        name: 'loginComp',
        data() {
            return {
                login: '',
                password: '',
                role: ''
            };
        },
        methods:{
            submitLogin(){
                if(this.role == "teacher"){
                    this.$router.push('/teacher');
                } else if (this.role == "student"){
                    this.$router.push('/student');
                }
            },
            redirectToSignUp(){
                this.$router.push('/signup');
            }
        }
    }
</script>
