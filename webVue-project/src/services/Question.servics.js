const upvote = (e) => {
  console.log(e)
  return fetch('http://localhost:3333/question/' + e + '/vote', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Authorization': localStorage.getItem('session_token'),
    },
  })
    .then((response) => {
      console.log(response)
      if (response.status === 200) {
        return 'upvoted'
      } else if (response.status === 401) {
        throw 'you need to be logedin to vote'
      } else if (response.status === 403) {
        throw 'You have already voted on this question'
      } else {
        throw 'server error '
      }
    })
    .then((resJson) => {
      return resJson
    })
    .catch((err) => {
      console.log(err)
      return Promise.reject(err)
    })
}

const downvote = (question_id) => {
  return fetch('http://localhost:3333/question/' + question_id + '/vote', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'X-Authorization': localStorage.getItem('session_token'),
    },
  })
    .then((response) => {
      if (response.status === 200) {
        return 'Downvoted'
      } else if (response.status === 401) {
        throw 'you need to be logedin to vote'
      } else if (response.status === 403) {
        throw 'You have already voted on this question'
      } else {
        throw 'server error '
      }
    })
    .catch((err) => {
      console.log(err)
      return Promise.reject(err)
    })
}

const askQuestion = (question, event_id) => {
  return fetch('http://localhost:3333/event/' + event_id + '/question', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Authorization': localStorage.getItem('session_token'),
    },
    body: JSON.stringify({
      question: question,
    }),
  })
    .then((response) => {
      console.log(response.text)
      if (response.status === 201) {
        return 'qestion asked'
      } else if (response.status === 403) {
        throw 'you cant ask questions on your own events or you are not registered to this event'
      } else if (response.status === 400) {
        throw 'profanity detected '
      } else throw 'server error'
    })
    .catch((err) => {
      console.log(err)
      return Promise.reject(err)
    })
}

const deleteQuestion = (question_id) => {
  return fetch('http://localhost:3333/question/' + question_id, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'X-Authorization': localStorage.getItem('session_token'),
    },
  }).then((response) => {
    console.log(response.status)
    if (response.status === 200) {
      return 'message deleted'
    } else if (response.status === 403) {
      throw 'You can only delete questions that have authored, or for events that you have created'
    } else throw 'server error'
  })
}

export const QuestionService = {
  upvote,
  downvote,
  askQuestion,
  deleteQuestion,
}
