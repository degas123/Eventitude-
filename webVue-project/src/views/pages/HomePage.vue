<template>
  <div>
    <h2> Where you can find like minded people search below to find events</h2>
    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <input class="h-50 w-2 searchbar" title="Search bar" type="text" v-model="text" placeholder="Search"
          aria-label="Search">
        <button class="btn btn-primary h-25 " title="Search button" type="submit">Search</button>
        <p>Select:
          <select title="Search option menu" v-model="status" class="btn dropdown-toggle">
            <option value="OPEN">Open</option>
            <option value="ARCHIVE">closed</option>
            <option v-if="session_token" value="ATTENDING">registered events</option>
            <option v-if="session_token" value="MY_EVENTS">My events</option>
          </select>
        </p>

        <p> Search offset: <input class="w-25 " title="Search offset" v-model="offset" type="number"></p>
        <p> Search Limit: <input class="w-25 " title="Search limit " v-model="limit" type="number"></p>

      </div>
    </form>


    <div v-if="Events.length">
      <div title="Event listings" v-for="event in Events" :key="event.event_id">
        <router-link :to="'/event/' + event.event_id">
          <eventComp :Name="event.name" :Event_id="event.id" />
        </router-link>
      </div>

    </div>
    <div v-if="error">
      {{ error }}
    </div>

  </div>
  <RouterView />

</template>

<script>
import { EventService } from '../../services/Events.servics';
import eventComp from "../components/event.components.vue";




export default {
  data() {
    return {
      Events: [],
      error: "",
      status: "",
      limit: "",
      offset: '',
      text: '',
      submitted: false,
      session_token: localStorage.getItem('session_token')

    }
  },
  methods: {
    handleSubmit(e) {
      this.submitted = true
      const { status, text, limit, offset } = this
      let query_params = "?"

      if (text) {
        query_params += "&q=" + text
      }
      if (status) {
        query_params += "&status=" + status
      }
      if (limit) {
        query_params += "&limit=" + limit
        // limit=100&offset=2
      }
      if (offset) {
        query_params += "&offset=" + offset
      }
      if (!text && !status && !limit && !offset) {
        query_params = ''
      }


      console.log("perams: " + query_params)
      console.log("http://localhost:3333/search" + query_params)

      EventService.searchEvent(query_params)
        .then(Events => {
          this.Events = Events
        })
        .catch(error => this.error = error)

      console.log(this.status)
      console.log(this.text)
    },
  },


  mounted() {
    EventService.getEvents()
      .then(Events => {
        this.Events = Events,
          this.loadtime = false
      })
      .catch(error => this.error = error)
  },
  components: {
    eventComp
  }
}

</script>
<style scoped>
@media only screen and (min-width: 1350px) {
  .form-group {
    justify-content: space-evenly;
    display: flex;
    size: 1%;
    max-height: fit-content;
    margin-bottom: 50px;
    font-size: 80%;


  }


}



.searchbar {
  margin-left: 4%;
  size: 1%;
}

#event {
  padding: 10px;
  text-align: center;
}

.dropdown-toggle {
  font-size: 100%;
  background-color: #F9FAF9;
}

.btn-primary {
  background-color: #F9FAF9;
  color: #000;
  border: #000;
}

.btn-primary:hover {
  background-color: #2E2A3E;
  color: #F9FAF9;
}

.eventDetales {
  border: 5px, solid, black;
  padding: 10px;
  margin: 5px;
  color: #000;
  background-color: #80737C;
  margin-left: 10%;
  margin-right: 10%;
}

.eventDetales:hover {
  color: #ffffff;
}

.form-group {
  justify-content: space-evenly;
  size: 1%;
  margin-bottom: 50px
}
</style>
