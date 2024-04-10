<template>
    <form @submit.prevent="handleSubmit">
        <h3>Sign up</h3>

        <div class="form-group">
            <label>First Name</label>
            <input type="text"  class="form-control" v-model="first_name" placeholder="First Name"/>

            <label>Last Name</label>
            <input type="text"  class="form-control" v-model="last_name" placeholder="Last Name"/>

            <label>Email</label>
            <input type="email"  class="form-control" v-model="email" placeholder="Email"/>

            <label>Password</label>
            <input type="password"  class="form-control" v-model="password" placeholder="Password"/>

            <label>Confirm Password</label>
            <input type="password"  class="form-control" v-model="password_confirmed" placeholder="Confirm password"/>
        </div>

        <button class="btn btn-primary btn-block">Sign Up</button>

    </form>
</template>

<script>
    import axios from 'axios'

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
            handleSubmit() {
                const data = {
                    first_name: this.firstName,
                    last_name: this.lastName,
                    email: this.email,
                    password: this.password,
                    password_confirmed: this.passwordConfirmed
                };
                
                axios.post('http://localhost:5173/signup', data)
                    .then(res => {
                        console.log(res);
                    })
                    .catch(err => {
                        console.log(err);
                    });
            }
        }
    }
</script>
