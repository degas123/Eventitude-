<template>
  <div class="eventDetales">
    <em v-if="Events.loading">loading event</em>
    <div v-else>
      <h1 title="Event details">Events Details</h1>
      <p title="Event id"><b>Event Id:</b> {{ Events.event_id }}</p>
      <p title="Event name "><b>Name of the event:</b> {{ Events.name }}</p>
      <p title="Event description"><b>Event description:</b> {{ Events.description }}</p>
      <p title="Event Location"> <b>Location:</b> {{ Events.location }}</p>
      <p title="Event Start date" v-if="!(Events.close_registration == -1)"><b>Start Date:</b> {{ new
        Date(Events.start).toUTCString() }}
      </p>

      <p title="Event closed" v-if="(Events.close_registration == -1)"> <b>Event closed</b> </p>
      <p title="Event Registration close date" v-if="!(Events.close_registration == -1)"><b>Registration Close Date:
        </b>{{ new
          Date(Events.close_registration).toUTCString() }}</p>

      <p title="Max attendees"><b>Max Number of attendees: </b>{{ Events.max_attendees }}</p>
      <p title="Number of attendees"><b>Number of attendees: </b>{{ Events.number_attending }}</p>
      <p title="Creator id"><b>Creators: User Id: </b>{{ Events.creator.creator_id }}</p>
      <p title="Name"><b>First Name: </b>{{ Events.creator.first_name }}</p>

      <!-- attendees -->
      <div v-if="session_token && user_id == Events.creator.creator_id">
        <h2 title="Attendees details"><b>Attendees details:</b></h2>
        <div v-for="attendees in Events.attendees" :key="attendees.user_id">
          <p title="User id"><b>User id:</b> {{ attendees.user_id }} </p>
          <p title="First name"><b>First name: </b>{{ attendees.first_name }} </p>
          <p title="Last name "><b>Last name:</b> {{ attendees.last_name }} </p>
          <p title="Email"><b>Email:</b> {{ attendees.email }} </p>
        </div>
      </div>

      <!-- question button and register -->
      <div class="button " v-if="session_token">
        <router-link style="text-decoration: none;" :to="'/event/' + Events.event_id + '/askQuestion'"><button
            title="Ask a question" class="btn btn-primary ">Ask a
            question</button></router-link>

        <button title="Register to event" type="button" class="btn btn-primary button" @click="register">Register to join
        </button>
        <div title="error message" v-if="error" class="alert alert-warning ">{{ error }}</div>
      </div>

      <!-- event owners options -->
      <div class="button" v-if="session_token && user_id == Events.creator.creator_id">
        <button title="Delete button" class="btn btn-danger button" v-if="Events.close_registration !== -1"
          variant="danger" @click="deleteEvent"> Delete Event </button>
        <button title="Edit event" class="btn btn-success button"><router-link
            style="text-decoration: none; color: white;" :to="'/event/' + Events.event_id + '/edit'">edit
            event</router-link></button>
      </div>

      <!-- Questions -->
      <h2 v-if="Events.questions.length">Questions</h2>
      <div v-if="Events.questions.length">
        <div v-for="questions in Events.questions" :key="questions.qestions_id">
          <p title="Question id "><b>Question_id: </b>{{ questions.question_id }}</p>
          <p title="Question"><b>Question: </b>{{ questions.question }}</p>
          <p title=" Votes"><b>Votes:</b> {{ questions.votes }}</p>

          <!-- question creator info -->
          <p title="Asked by"><b>Asked_by: </b></p>
          <p><b>User id: </b>{{ questions.asked_by.user_id }}</p>
          <p><b>Name: </b>{{ questions.asked_by.first_name }}</p>

          <!-- votes -->
          <div v-if="session_token">
            <button title="Upvote" class="btn btn-primary" @click="upvote(questions.question_id)">Upvote</button>
            <button title="Downvote" class="btn btn-primary" @click="downvote(questions.question_id)">Downvote</button>
            <button title="Delete question" class="btn btn-danger"
              v-if="this.user_id == questions.asked_by.user_id || this.user_id == Events.creator.creator_id"
              @click="deleteQuestion(questions.question_id)">delete</button>
          </div>
        </div>
      </div>
    </div>
  </div>

</template>

<script>

import { EventService } from '../../services/Events.servics';
import eventComp from "../components/event.components.vue";
import { QuestionService } from '../../services/Question.servics'



export default {



  data() {
    return {
      Events: {},
      error: "",
      session_token: localStorage.getItem('session_token'),
      user_id: localStorage.getItem('user_id'),
      askedQuestion: false
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

    deleteEvent(e) {
      EventService.deleateEvent(this.$route.params.id)
        .then((event) => {
          if (event) {
            this.loadEvents();
          }
          console.log(event),
            console.log("deleted?")
        }).catch(error => this.error = error)
    },
    upvote(e) {
      console.log("event?" + e)
      QuestionService.upvote(e)
        .then((questionRes) => {
          if (questionRes) {
            console.log(questionRes)
            this.loadEvents()
            alert(questionRes)
          }
        })
        .catch(error => this.error = error)

    },

    downvote(e) {
      console.log("event? " + e)
      QuestionService.downvote(e)
        .then((questionRes) => {
          if (questionRes) {
            console.log(questionRes)
            this.loadEvents()
            alert(questionRes)
          }
        })
        .catch(error => this.error = error)
    },

    register() {
      EventService.register(this.$route.params.id)
        .then((register) => {
          if (register) {
            console.log("you are have registed")
            console.log(register)
            this.loadEvents()
          }
        })
        .catch(error => this.error = error)
    },
    deleteQuestion(question_id) {
      QuestionService.deleteQuestion(question_id)
        .then((question) => {
          if (question) {
            this.loadEvents()
          }
        })
    }
  },
  created() {
    this.loadEvents()
  },

  components: {
    eventComp
  }
}

</script>

<style scoped>
.eventDetales {
  border: 5px, solid, black;
  padding: 10px;
  margin: 5px;
  text-align: center;
  background-color: #80737C;
  margin: 10%;
  margin-bottom: 25%;
}

.button {
  margin: 5px;
  display: inline;
  justify-content: center;

}
</style>
