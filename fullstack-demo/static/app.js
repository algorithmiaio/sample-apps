var API_URL='http://127.0.0.1:5000';

var app = new Vue({
  el: '#app',
  data: {
    error: null,
    avatar_loading: false,
    user: null,
    update_time: null,
    login: {email: null, password: null},
    token: null
  },
  methods: {
    register: function() {
      // POST new username & password to /register, then update token and user data
      app.error = null;
      axios.post(API_URL+'/register', {email: app.login.email, password: app.login.password})
      .then(function(response) {
        console.log(response);
        app.token = response.data.token;
        localStorage.token = app.token;
        app.user = response.data.user;
        app.update_time = Date.now();
      },
      function(err) {
        app.error = err.response.data.message;
      });
    },
    logIn: function() {
      // POST existing username & password to /login, then update token and user data
      app.error = null;
      axios.post(API_URL+'/login', {email: app.login.email, password: app.login.password})
      .then(function(response) {
        app.token = response.data.token;
        localStorage.token = app.token;
        app.user = response.data.user;
        app.update_time = Date.now();
      },
      function(err) {
        app.error = err.response.data.message;
      });
    },
    logOut: function() {
      // clear all data and erase the token from localStorage
      app.error = null;
      app.user = null;
      app.login = {email: null, password: null};
      app.token = null;
      localStorage.token = null;
    },
    updateUser: function() {
      // update the User's profile on the server, then refresh the local copy
      app.error = null;
      axios.post(API_URL+'/account', app.user, {headers: {Authorization: 'Bearer: '+app.token}})
      .then(function(response) {
        app.error = "Your changes have been saved";
        app.user = response.data.user;
        app.update_time = Date.now();
      },
      function(err) {
        if(err.response.status==401) {
          return app.logOut();
        }
        app.error = err.response.data.message;
      });
    },
    triggerAvatar: function() {
      // proxy the user's button-click onto the file-upload form
      this.$refs.avatar.click()
    },
    updateAvatar: function() {
      // send a new profile image and refresh the local user profile
      var formData=new FormData();
      fileList=this.$refs.avatar.files;
      if(!fileList.length) return;
      formData.append('avatar',fileList[0],fileList[0].name);
      var url=API_URL+'/avatar';
      app.error="Processing your image...";
      app.avatar_loading = true;
      axios.post(url,formData, {headers: {Authorization: 'Bearer: '+app.token, 'Content-Type': 'multipart/form-data'}} )
      .then(function(response) {
        app.error = null;
        app.avatar_loading = false;
        app.user = response.data.user;
        app.update_time = Date.now();
      },
      function(err) {
        if(err.response.status==401) {
          return app.logOut();
        }
        app.error=err.response.data.message;
        app.avatar_loading=false;
      });
    }
  },
  mounted: function() {
    //on login, load token from local storage; if it hasn't expired, refresh it and log user in
    var token = localStorage.token;
    if (token && token.split('.').length >= 3) {
      var data=JSON.parse(atob(token.split('.')[1]));
      var exp=new Date(data.exp*1000);
      if(new Date()<exp) {
        axios.get(API_URL+'/account',{headers:{Authorization:'Bearer: '+token}})
        .then(function(response) {
          app.token=response.data.token;
          localStorage.token=app.token;
          app.user=response.data.user;
          app.update_time=Date.now();
        });
      }
    }
  }
});