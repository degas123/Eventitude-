const login = (email, password) => {
  return fetch('http://localhost:3333/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: email,
      password: password,
    }),
  })
    .then((response) => {
      if (response.status == 200) {
        return response.json()
      } else {
        console.log(response.status)
        throw 'incorrect password or email'
      }
    })
    .then((resJson) => {
      localStorage.setItem('user_id', resJson.user_id)
      localStorage.setItem('session_token', resJson.session_token)
      return resJson
    })
    .catch((error) => {
      return Promise.reject(error)
    })
}

const logout = () => {
  return fetch('http://localhost:3333/logout', {
    method: 'POST',

    headers: {
      'Content-Type': 'application/json',
      'X-Authorization': localStorage.getItem('session_token'),
    },
  })
    .then((response) => {
      if (response.status == 200) {
        localStorage.removeItem('session_token')
        localStorage.removeItem('user_id')
        return 'logout'
      } else {
        console.log(response.status)
        console.log(response)
        return response.json()
      }
    })
    .then((resJson) => {
      return resJson
    })

    .catch((error) => {
      return Promise.reject(error)
    })
}

const RegisterUser = (firstName, LastName, email, password) => {
  return fetch('http://localhost:3333/users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      first_name: firstName,
      last_name: LastName,
      email: email,
      password: password,
    }),
  })
    .then((response) => {
      if (response.status == 201) {
        return 'registered'
      } else if (response.status === 400) {
        console.log(response.status)
        throw 'email aready used'
      } else {
        console.log(response.status)
        console.log(response)
        return response.json()
      }
    })
    .then((resJson) => {
      console.log(resJson)
      return resJson
    })

    .catch((error) => {
      console.log('Err:', error)
      return Promise.reject(error)
    })
}

export const UserService = {
  login,
  logout,
  RegisterUser,
}
