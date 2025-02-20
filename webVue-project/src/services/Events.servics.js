const makeEvent = (
  event_name,
  description,
  location,
  start,
  close_registration,
  number_attending,
) => {
  return fetch('http://localhost:3333/events', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Authorization': localStorage.getItem('session_token'),
    },
    body: JSON.stringify({
      name: event_name,
      description: description,
      location: location,
      start: start,
      close_registration: close_registration,
      max_attendees: number_attending,
    }),
  })
    .then((response) => {
      if (response.status === 201) {
        return response.json()
      } else if (response.status === 400) {
        throw 'prefanity detected'
      } else {
        console.log(response.status)
        console.log(response)
        throw 'error'
      }
    })
    .then((resJson) => {
      return resJson
    })

    .catch((error) => {
      return Promise.reject(error)
    })
}

const getEvents = () => {
  return fetch('http://localhost:3333/search')
    .then((response) => {
      if (response.status === 200) {
        return response.json()
      } else throw 'Somthing went wrong'
    })
    .then((resJson) => {
      return resJson
    })
    .catch((error) => {
      console.log('Err:', error)
      return Promise.reject(error)
    })
}

const getOneEvent = (id) => {
  return fetch('http://localhost:3333/event/' + id, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'X-Authorization': localStorage.getItem('session_token'),
    },
  })
    .then((response) => {
      if (response.status === 200) {
        return response.json()
      } else throw 'no event found'
    })
    .then((resJson) => {
      return resJson
    })
    .catch((error) => {
      console.log('Err:', error)
      return Promise.reject(error)
    })
}

const searchEvent = (query_params) => {
  console.log(query_params)
  return fetch('http://localhost:3333/search' + query_params, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'X-Authorization': localStorage.getItem('session_token'),
    },
  })
    .then((response) => {
      console.log(response.status)
      if (response.status === 200) {
        return response.json()
      } else {
        console.log(response.status)
        return response.json()
      }
    })
    .then((resJson) => {
      return resJson
    })
    .catch((error) => {
      console.log('Err:', error)
      return Promise.reject(error)
    })
}

const deleateEvent = (event_id) => {
  return fetch('http://localhost:3333/event/' + event_id, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'X-Authorization': localStorage.getItem('session_token'),
    },
  })
    .then((response) => {
      console.log(response)
      if (response.status === 200) {
        return 'deleted'
      } else {
        return response.json()
      }
    })
    .then((resJson) => {
      return resJson
    })
    .catch((error) => {
      console.log('Err:', error)
      return Promise.reject(error)
    })
}

const updateEvent = (
  event_id,
  event_name,
  description,
  location,
  start,
  close_registration,
  number_attending,
) => {
  return fetch('http://localhost:3333/event/' + event_id, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'X-Authorization': localStorage.getItem('session_token'),
    },
    body: JSON.stringify({
      name: event_name,
      description: description,
      location: location,
      start: start,
      close_registration: close_registration,
      max_attendees: number_attending,
    }),
  })
    .then((response) => {
      if (response.status === 200) {
        return 'uppdated'
      } else if (response.status === 401) {
        throw 'You need to log in to edit your events'
      } else if (response.status === 403) {
        console.log('You can only edit events you have made')
      } else if (response.status === 404) {
        throw 'Event not found'
      } else if (response.status === 400) {
        throw 'perfanity detected or invalid input.'
      }
    })
    .then((resJson) => {
      return resJson
    })
    .catch((error) => {
      console.log('Err:', error)
      return Promise.reject(error)
    })
}

const register = (event_id) => {
  return fetch('http://localhost:3333/event/' + event_id, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Authorization': localStorage.getItem('session_token'),
    },
  }).then((response) => {
    console.log(response)
    if (response.status === 200) {
      return 'registered'
    } else if (response.status === 401) {
      throw 'Unauthorised'
    } else if (response.status === 403) {
      throw 'you are already registered or Event is as Capacity'
    } else throw 'server error'
  })
}

export const EventService = {
  getEvents,
  getOneEvent,
  searchEvent,
  makeEvent,
  deleateEvent,
  updateEvent,
  register,
}
