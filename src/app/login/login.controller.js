angular.module('sagremorApp')
  .controller('LoginCtrl', [
  '$scope',
  '$location',
  '$cookieStore',
  '$http',
  'angharadFactory',
  function($scope, $location, $cookies, $http, angharadFactory) {
      
      var self = this;
      
      this.username = "";
      this.password = "";
      this.rememberMe = false;
      
      this.init = function() {
          if ($scope.isLogged) {
              $location.path("/");
          }
      };
      
      this.postLogin = function() {
          var validity = new Date();
          if (this.rememberMe) {
              validity.setFullYear(validity.getFullYear() + 10);
          } else {
              validity.setUTCSeconds(0);
          }
          angharadFactory.postAuth(self.username, self.password, Math.round(validity.getTime() / 1000))
            .then(function (response) {
                $cookies.put("ANGHARAD_SESSION_ID", response.token);
                $http.defaults.headers.common["ANGHARAD_SESSION_ID"] = response.token;
                $scope.isLogged = true;
                $location.path("/");
            },
            function (error) {
                console.log("login error", error);
            });
      };
      
      self.init();
  }
]);
