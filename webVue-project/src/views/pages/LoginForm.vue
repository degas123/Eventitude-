<template>

  <form class="log" @submit.prevent="handleSubmit">
    <h1>Login</h1>
    <div><label id="email">Email</label><br>
      <input type="email" v-model="email" name="email" placeholder="email" />
      <div v-show="submitted && !email" class="alert alert-warning "> Email is required</div>
    </div>

    <div><label id="password">Password</label><br>
      <input id="password" type="password" v-model="password" name="password" placeholder="*********" />
      <div v-show="submitted && !password" class="alert alert-warning ">password is required</div>
    </div>

    <button class="logbox btn btn-primary" @click="">Login</button>
    <div v-if="error" class="alert alert-warning ">{{ error }}</div>
  </form>
  <footer>
    <p>
      Dont have an account? <router-link to="/register">Register</router-link>
    </p>
  </footer>

</template>


<script>

import { UserService } from '../../services/User.service';
import validator from 'email-validator'

export default {
  data() {
    return {
      email: "",
      password: "",
      submitted: false,
      error: ""

    }
  },

  methods: {

    handleSubmit(e) {
      this.submitted = true
      // alert("button cliked")

      const { email, password } = this
      if (!(email && password)) {
        return
      }
      else if (!(validator.validate(email))) {
        this.error = "Email must be a valid email"
        return;
      }

      else if (!(password)) {
        this.error = "Passworld not strong enough."
        return;
      }

      else {
        UserService.login(email, password)
          .then(result => {
            console.log("Test" + result)
            if (result) {
              console.log("test" + result)
              window.location.reload()
            }
          })
          .catch(error => this.error = error)
      }
    },
  },

}
</script>
<style>
.log {
  border: 5px, solid, black;
  text-align: center;
  justify-content: space-evenly;
  padding: 10px;
  margin: 5px;
  color: #000;
  background-color: #80737C;
  margin: 15%;
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

.logbox {
  margin: 5px;
  background-color: #F9FAF9;
  color: #000;

}
</style>
