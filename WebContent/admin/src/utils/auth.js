/* globals localStorage */

export default {
  login (email, pass, cb) {
    cb = arguments[arguments.length - 1]
    if (localStorage.manageTokenCode) {
      if (cb) cb(true)
      this.onChange(true)
      return
    }
    pretendRequest(email, pass, (res) => {
      if (res.authenticated) {
        localStorage.manageTokenCode = res.manageTokenCode
        if (cb) cb(true)
        this.onChange(true)
      } else {
        if (cb) cb(false)
        this.onChange(false)
      }
    })
  },

  getToken () {
    return localStorage.manageTokenCode
  },

  logout (cb) {
    delete localStorage.manageTokenCode
    if (cb) cb()
    this.onChange(false)
  },

  loggedIn () {
    return !!localStorage.manageTokenCode
  },

  onChange () {}
}

function pretendRequest (email, pass, cb) {
  setTimeout(() => {
    if (email === 'joe@example.com' && pass === 'password1') {
      cb({
        authenticated: true,
        token: Math.random().toString(36).substring(7)
      })
    } else {
      cb({ authenticated: false })
    }
  }, 0)
}
