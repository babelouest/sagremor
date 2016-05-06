angular.module('angharadApp')
  .controller('loginCtrl', [
  '$scope',
  '$location',
  '$cookieStore',
  'angharadFactory',
  function($scope, $location, $cookieStore, angharadFactory) {
      
      var self = this;
      
      this.username = "";
      this.password = "";
      
      this.postLogin = function() {
          angharadFactory.postAuth(self.username, self.password)
            .then(function (response) {
                $cookieStore.put("ANGHARAD_SESSION_ID", response.data.token);
                $http.defaults.headers.common["ANGHARAD_SESSION_ID"] = response.data.token;
                angharadFactory.getSumboduleList()
                    .then(function(response) {
                        console.log("submodule", response);
                    }, function (error) {
                        console.log("error submodule", error);
                    });
            },
            function (error) {
                console.log("login error", error);
            });
      };
  }
]);
