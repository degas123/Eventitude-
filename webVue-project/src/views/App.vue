<template class="style">
  <div class="nav">

    <h1 class="title">Eventitude</h1>
    <nav id="nav" class="navbar navbar-expand-lg  navbar-light">
      <div class="container-fluid">
        <button title="Dropdown " class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarSupportedContent" v-if="showLogin">
          <RouterLink style="text-decoration: none; color: black;" to="/"><button class="btn app nav-item"
              title="To Home home">Home</button></RouterLink>

          <RouterLink style="text-decoration: none; color: black;" to="/register"><button class="btn app"
              title="To Register page">Register </button></RouterLink>

          <RouterLink style="text-decoration: none; color: black;" to="/login"> <button class="btn app"
              title="To Login Page">Login </button></RouterLink>

        </div>
        <div class="collapse navbar-collapse" id="navbarSupportedContent" v-if="showLogout">

          <RouterLink style="text-decoration: none; color: black;" to="/"><button class="btn app"
              title="To home page">Home </button></RouterLink>

          <RouterLink style="text-decoration: none; color: black;" to="/" v-on:click='logoutUser'><button
              class="btn app" title="Logout">Logout </button></RouterLink>

          <RouterLink style="text-decoration: none; color: black;" to="/MakeEvent"><button class="btn app nav-item"
              title="Create event">Make Event</button> </RouterLink>
        </div>
      </div>
    </nav>
  </div>
  <RouterView />
  <footer>
    <p>copyright @jamesthorpe</p>
  </footer>
</template>

<script>
import { UserService } from '../services/User.service';
export default {

  data() {
    return {
      showDashboard: false,
      showLogin: false,
      session_token: localStorage.getItem('session_token'),
      error: ""
    }
  },
  methods: {
    update: function () {
      if (localStorage.getItem('session_token')) {
        this.showLogout = true
        this.showLogin = false
      } else if (localStorage.getItem('session_token') === null) {
        this.showLogin = true
        this.showLogout = false
      }
    },
    logoutUser() {
      UserService.logout(this.session_token)
        .then(logout => {
          console.log("logged Out")
          if (logout) {
            window.location.reload()

          }
        })
        .catch(error => this.error = error)
    }
  },
  created() {
    this.update()
  }
}
</script>
<style>
.nav {
  font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
  text-align: center;
  color: black;
  background-color: #2E2A3E;
  display: flex;
  justify-content: space-evenly;
  padding-top: 5px;
  margin-bottom: 20px;
  font-size: 150%;

}
p{
  font-family: Rubik, sans-serif;
}

#app {
  font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
  text-align: center;
  color: black;
  background-color: #9799A1;
  font-size: 150%;
}

.app,
.navbar-toggler {
  /* font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif; */
  background-color: #F9FAF9;
  color: #000;
  text-align: center;
  padding: 10px 15px;
  margin: 0px 20px;
  font-size: 50%;
  display: block;
}

.app:hover,
.navbar-toggler:hover {
  background-color: #9799A1;
  color: #000;
  text-align: center;
  padding: 10px 15px;
  margin: 0px 20px;
  font-size: 50%;
}
.style{background-color: #9799A1}
.title {
  margin-top: 2px;
  font-size: 150%;
  color: #F9FAF9;
}

.btn-primary {
  background-color: #F9FAF9;
  color: #000;
  ;
}

.btn-primary:hover {
  background-color: #2E2A3E;
  color: #F9FAF9;
}
</style>
