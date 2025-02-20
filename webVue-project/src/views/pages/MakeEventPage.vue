<template>

  <form @submit.prevent="handleSubmit" class="comment eventDetales">
    <h1>Make Event</h1>
    <div> <label>Event Name: </label> <br>
      <input title="Event name input" type="text" v-model="event_name" placeholder="Event Name">
      <div v-show="submitted && !event_name" class="alert alert-warning">name is required!</div>
    </div>
    <div><label>Event Discription: </label><br>
      <textarea title="Event discription input" v-model="description" placeholder="Event Discription" rows="4"
        cols="25"></textarea>
      <div v-show="submitted && !description" class="alert alert-warning"> event description is required!</div>
    </div>
    <div><label>Event Location: </label> <br>
      <textarea title="Event location input" v-model="location" placeholder="Event Location" rows="4" cols="25"></textarea>
      <div v-show="submitted && !location" class="alert alert-warning ">location is required!</div>

    </div>
    <div><label>Start Date: </label><br>
      <input title="Start date input" v-model="start" type="datetime-local">
      <div v-show="submitted && !start" class="alert alert-warning  ">start date is required!</div>
    </div>
    <div><label>Registration Close: </label><br>
      <input title="Close registration date input" v-model="close_registration" type="datetime-local">
      <div v-show="submitted && !close_registration" class="alert alert-warning ">close registration date is required!
      </div>
    </div>
    <div>
      <label>max attendees: </label><br>
      <input title="Max attendees input" v-model="number_attending" type="number">
      <div v-show="submitted && !number_attending" class="alert alert-warning ">number of attendees is required!</div>
    </div>

    <button title="Create event button" class="btn btn-primary" type="submit">Create</button>
    <div v-if="error" class="alert alert-danger ">{{ error }}</div>

  </form>
</template>

<script>
import { EventService } from '@/services/Events.servics';

export default {
  data() {
    return {
      event_name: "",
      description: "",
      location: "",
      start: Date,
      close_registration: Date,
      number_attending: 0,
      session_token: localStorage.getItem('session_token'),
      submitted: false,
      error: ""
    }

  },
  methods: {
    handleSubmit(e) {
      this.submitted = true
      const { event_name, description, location, start, close_registration, number_attending, session_token } = this
      if (session_token == null) { return }
      if (!(event_name && description && start && close_registration && number_attending)) {
        return
      }
      console.log(this)
      const unixstart = Math.floor(new Date(start).getTime())
      const unixclose = Math.floor(new Date(close_registration).getTime())
      console.log(unixclose)



      EventService.makeEvent(event_name, description, location, unixstart, unixclose, number_attending, session_token)
        .then((response) => {
          console.log("success creat Event")
          if (response && response.error_message) {
            this.error = response.error_message;

          } else if (response) {
            this.$router.push('/')
          }


        })
        .catch(error => this.error = error)
    }
  },


}
</script>

<style scoped>
.comment {
  /* border: 5px, solid, black; */
  padding: 10px;
  margin: 5px;
  color: #000;
  /* background-color: #0CA4A5; */
}

.eventDetales {
  border: 5px, solid, black;
  padding: 10px;
  margin: 5px;
  color: #000;
  background-color: #80737C;
  margin-top: 5%;
  margin-left: 10%;
  margin-right: 10%;
  margin-bottom: 25%;
}
</style>
