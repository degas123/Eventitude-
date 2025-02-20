<template>
  <div class="eventDetales2">
    <em v-if="Events.loading">loading event</em>
    <div v-else>
      <div title="event detales" class="event">
        <p><b>Event Id: </b>{{ Events.event_id }}</p>
        <p><b>Name of the event:</b> {{ Events.name }}</p>
        <p><b>Event description: </b>{{ Events.description }}</p>
        <p><b>Location: </b>{{ Events.location }}</p>
        <p v-if="!(Events.close_registration == -1)"><b>Start Date:</b> {{ new Date(Events.start).toUTCString() }}
        </p>
        <p v-if="(Events.close_registration == -1)"><b>Event closed </b> </p>
        <p v-if="!(Events.close_registration == -1)"><b>Registration Close Date: </b>{{ new
          Date(Events.close_registration).toUTCString() }}</p>
        <p><b>Max Number of attendees: </b>{{ Events.max_attendees }}</p>
      </div>


      <form @submit.prevent="handleSubmit" class="comment">
        <h2>Update your event</h2>
        <div><label>Event Name: </label><br />
          <input title="Event name" type="text" v-model="event_name" placeholder="Event Name">
        </div>
        <div><label>Event Discription: </label><br />
          <textarea title="Event discription" v-model="description" placeholder="Event Discription"
            cols="25"></textarea>
        </div>
        <div><label>Event Location: </label><br />
          <textarea title="Event location" class="text" v-model="location" placeholder="Event Location"
            cols="25"></textarea>
        </div>
        <div>
          <p>if you want up date the start date and time or the registed close please update both: </p>
          <label>Start Date: </label> <br />
          <input title="start date" v-model="start" type="datetime-local">
        </div>
        <div> <label>Registration Close: </label><br />
          <input title="Registration close date" v-model="close_registration" type="datetime-local">
        </div>
        <div><label>max attendees: </label><br />
          <input title="Max attendees " v-model="number_attending" type="number">
        </div>

        <button title="Submit button" class="btn btn-success" type="submit">update</button>
        <div v-if="error" class="alert alert-warning ">{{ error }}</div>
        <br>
      </form>
    </div>
  </div>

</template>

<script>
import { EventService } from '@/services/Events.servics';

export default {
  data() {
    return {
      Events: {},
      event_name: "",
      description: "",
      location: "",
      start: Date,
      close_registration: Date,
      number_attending: "",
      session_token: localStorage.getItem('session_token'),
      submitted: false,
      error: ""
    }

  },
  methods: {
    loadEvents() {
      EventService.getOneEvent(this.$route.params.id)
        .then((event) => {
          this.Events = event
          console.log(event)
        })
        .catch(error => this.error = error)
    },

    handleSubmit(e) {

      this.submitted = true
      const { event_name, description, location, start, close_registration, number_attending, session_token } = this
      console.log("number" + this.number_attending)
      if (session_token == null) { return }

      if (event_name == "") {
        this.event_name = null
      }
      if (description == "") {
        this.description = null
      }
      if (location == "") {
        this.location = null
      }
      if (start == null) {
        this.start = null
      }
      if (close_registration == null) {
        this.close_registration = null
      }

      if (number_attending == "") {
        this.number_attending = null;
      }


      console.log(number_attending)
      const unixstart = Math.floor(new Date(start).getTime())
      const unixclose = Math.floor(new Date(close_registration).getTime())

      console.log("name " + event_name)
      console.log("description: " + description)
      console.log("location" + location)
      console.log("number" + this.number_attending)


      // console.log(unixclose)

      EventService.updateEvent(this.$route.params.id, this.event_name, this.description, this.location, unixstart, unixclose, this.number_attending, session_token)
        .then((response) => {
          console.log("success creat Event")
          if (response && response.error_message) {
            this.error = response.error_message;
          } if (response) { this.loadEvents() }
        })
        .catch(error => this.error = error)
    }
  },
  created() {
    this.loadEvents()
  }
}
</script>

<style scoped>
.comment {
  border: 5px, solid, black;
  padding: 10px;
  margin: 5px;
  text-align: center;
  background-color: #80737C;
  margin: 10%;
  margin-bottom: 25%;
}

.event {
  color: #2E2A3E;
  margin-top: 5%;
}

.text {
  size: 1%;
}
</style>
