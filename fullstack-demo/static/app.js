var API_URL='http://127.0.0.1:5000';

var app = new Vue({
  el: '#app',
  data: {
    error: null,
    user: null,
    login: {email: null, password: null},
    token: null
  },
  methods: {
    isValidJwt: function(token) {
      if (token && token.split('.').length >= 3) {
        var data = JSON.parse(atob(token.split('.')[1]));
        var exp = new Date(data.exp * 1000); // JS deals with dates in milliseconds since epoch
        var now = new Date();
        return now < exp;
      }
      return false;
    },
    register: function() {
      app.error = null;
      axios.post(API_URL+'/register', {email: app.login.email, password: app.login.password}).then(
        function (response) {
          console.log(response);
          app.token = response.data.token;
          localStorage.token = app.token;
          app.user = response.data.user;
        },
        function (err) {
          app.error = err.response.data.message;
        }
      );
    },
    logIn: function() {
      app.error = null;
      axios.post(API_URL+'/login', {email: app.login.email, password: app.login.password}).then(
        function (response) {
          app.token = response.data.token;
          localStorage.token = app.token;
          app.user = response.data.user;
        },
        function (err) {
          app.error = err.response.data.message;
        }
      );
    },
    logOut: function() {
      app.error = null;
      app.token = null;
      app.user = null;
      app.login = {email: null, password: null};
      app.token = null;
      localStorage.token = null;
    },
    updateBio: function() {
      app.error = null;
      axios.post(API_URL+'/account', {bio: app.user.bio}, {headers: {Authorization: 'Bearer: '+app.token}}).then(
        function (response) {
          app.user = response.data.user;
        },
        function (err) {
          if(err.response.status==401) {
            return app.logOut();
          }
          app.error = err.response.data.message;
        }
      );
    },
    triggerAvatar: function() {
      this.$refs.avatar.click()
    },
    updateAvatar: function() {
      var formData=new FormData();
      fileList=this.$refs.avatar.files;
      if(!fileList.length) return;
      formData.append('avatar',fileList[0],fileList[0].name);
      var url=API_URL+'/account';
      app.error="Processing your image...";
      axios.post(url,formData, {headers: {Authorization: 'Bearer: '+app.token, 'Content-Type': 'multipart/form-data'}} ).then(
        function(response) {
          app.user = response.data.user;
          app.error = null;
        },
        function(err) {
          if(err.response.status==401) {
            return app.logOut();
          }
          app.error = err.response.data.message;
        }
      );
    }
  },
  mounted: function() {
    var token = localStorage.token;
    if (this.isValidJwt(token)) {
      axios.get(API_URL+'/account', {headers: {Authorization: 'Bearer: '+token}}).then(
        function (response) {
          app.token = response.data.token;
          localStorage.token = app.token;
          app.user = response.data.user;
        }
      );
    }
  }
});