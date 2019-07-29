var API_URL='http://127.0.0.1:5000';

var app = new Vue({
  el: '#app',
  data: {
    message: 'Welcome!',
    error: null,
    user: null,
    login: {email: null, password: null},
    jwt: null
  },
  methods: {
    findUser: function(id) {
      app.error = null;
      axios.get(API_URL+'/account?id=' + id).then(
        function (response) {
          console.log(response);
          app.user = response.data.user;
          },
        function (err) {
          app.error = err.response.data.message;
        }
      );
    },
    register: function() {
      app.error = null;
      axios.post(API_URL+'/register', {email:app.login.email, password:app.login.password}).then(
        function (response) {
          console.log(response);
          jwt = response.data.token;
          app.user = response.data.user;
        },
        function (err) {
          app.error = err.response.data.message;
        }
      );
    },
    logIn: function() {
      app.error = null;
      axios.post(API_URL+'/login', {email:app.login.email, password:app.login.password}).then(
        function (response) {
          console.log(response);
          jwt = response.data.token;
          app.user = response.data.user;
        },
        function (err) {
          app.error = err.response.data.message;
        }
      );
    },
    logOut: function() {
      app.error = null;
      app.jwt = null;
      app.user = null;
      app.login = {email: null, password: null};
      app.jwt = null;
    }
  },
  mounted: function() {
    // this.findUser('foo@bar.tld');
  }
});

isValidJwt = function(jwt) {
  if (jwt && jwt.split('.').length >= 3) {
    var data = JSON.parse(atob(jwt.split('.')[1]));
    var exp = new Date(data.exp * 1000); // JS deals with dates in milliseconds since epoch
    var now = new Date();
    return now < exp;
  }
  return false;
};