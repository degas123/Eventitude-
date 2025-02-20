<template>

  <form class="reg" @submit.prevent="handleSubmit">
    <h1> Register </h1>
    <div class="regbox"><label>First name<br>
        <input type="textbox" v-model="first_name" name="first_name" title="first name input" /></label>
      <div v-show="submitted && !first_name" class="alert alert-warning ">First name is required</div>
    </div>

    <div class="regbox">
      <label>Last name <br>
        <input type="textbox" v-model="last_name" name="last name" title="last name input"></label>
      <div v-show="submitted && !last_name" class="alert alert-warning ">Last name is required</div>
    </div>

    <div class="regbox"><label>Email<br>
        <input type="email" title="email" v-model="email" name="email" placeholder="Email" /></label>

      <div v-show="submitted && !email" class="alert alert-warning "> Email is required</div>
    </div>

    <div class="regbox"><label>Password<br>
        <input type="password" v-model="password" name="password" placeholder="*********"
          title="password input" /></label>

      <div v-show="submitted && !password" class="alert alert-warning ">password is required</div>
    </div>

    <div class="regbox"><label>Confirm Password<br>
        <input type="password" v-model="conferm_pass" name="conferm_pass" placeholder="*********"
          title="confirm password input" /></label>

      <div v-show="submitted && !conferm_pass" class="alert alert-warning ">password is required</div>
    </div>

    <button class="regbox btn btn-primary" title="submit button">
      Register
    </button>
    <div v-if="error" class="alert alert-warning ">{{ error }}</div>
  </form>
  <footer>
    <p>
      Already have a account? <router-link title="to login page" to="/login">Login</router-link>
    </p>
  </footer>
</template>
<script>

import { UserService } from '../../services/User.service';
import validator from 'email-validator'
export default {
  data() {
    return {
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      conferm_pass: "",
      submitted: false,
      error: ""
    }
  },

  methods: {
    handleSubmit(e) {
      this.submitted = true

      const { first_name, last_name, email, password, conferm_pass } = this
      console.log(conferm_pass)
      const nameTestRegex = /^[a-zA-Z]{2,32}$/
      if (!(email && password && first_name && last_name)) {
        return
      }
      if (!(nameTestRegex.test(last_name))) {
        this.error = "Last name needs to be more than 2 letters and have no special charcters"
        return
      }
      if (!(nameTestRegex.test(first_name))) {
        this.error = "First name needs to be more than 2 letters and have no special charcters"
        return
      }
      if (!(validator.validate(email))) {
        this.error = "Email must be a valid email"
        return;
      }
      const password_patten = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,30}$/
      if (!(password_patten.test(password))) {
        this.error = "Passworld not strong enough."
        return;
      }
      if (password !== conferm_pass) {
        this.error = "passworld must match"
        console.log(password)
        console.log({ "confirm": conferm_pass })

        return
      }
      UserService.RegisterUser(first_name, last_name, email, password)
        .then((response) => {
          console.log("success creat user")
          if (response && response.error_message) {
            this.error = response.error_message;
          }
          this.$router.push("/login")
        })
        .catch(error => this.error = error)

    }
  }
}
</script>
<style>
.reg {
  border: 5px, solid, black;
  text-align: center;
  justify-content: space-evenly;
  padding: 10px;
  margin: 5px;
  color: #000;
  background-color: #80737C;
  margin: 10%;
margin-bottom: 25%;
}

.btn-primary {
  background-color: #F9FAF9;
  color: #000;
  border: #000;
}

.btn-primary:hover {
  background-color: #2E2A3E;
  color: #F9FAF9;
  border: #000;
}

.regbox {
  margin: 5px;

}
</style>
