<template>
  <div class="question">
    <form @submit.prevent="handleSubmit" class="comment">
      <label>Question </label>
      <br>
      <textarea title="Question input" v-model="question" placeholder="Your Question" rows="4" cols="35"></textarea>
      <div v-show="submitted && !question" class="alert alert-warning "> Question is required</div>
      <br>
      <button title="Submit question" class="btn btn-primary" type="submit">Create question</button>
      <div title="error message" v-if="error" class="alert alert-warning ">{{ error }}</div>
    </form>
  </div>
</template>
<script>
import { QuestionService } from '../../services/Question.servics';

export default {
  data() {
    return {
      question: "",
      session_token: localStorage.getItem('session_token'),
      submitted: false,
      error: ""
    }

  },
  methods: {
    handleSubmit(e) {
      this.submitted = true
      const { question, session_token } = this
      if (session_token == null) { return }
      if (!(question)) {
        return
      }
      console.log(this)

      QuestionService.askQuestion(this.question, this.$route.params.id)
        .then((response) => {
          console.log(response)

          if (response && response.error_message) {
            this.error = response.error_message


          } else if (response) {
            console.log("success creat question")
            this.$router.push('/event/' + this.$route.params.id)
          }


        })
        .catch(error => this.error = error)
    }
  },

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

.btn-primary {
  background-color: #F9FAF9;
  color: #000;
  border: #000;
}

.btn-primary:hover {
  background-color: #2E2A3E;
  color: #F9FAF9;
}
</style>
