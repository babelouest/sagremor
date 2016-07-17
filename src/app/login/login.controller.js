angular.module("sagremorApp")
  .controller("LoginCtrl",
  function($scope, $rootScope, $location, $cookieStore, $http, toaster, angharadFactory) {
      
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
                $cookieStore.put("ANGHARAD_SESSION_ID", response.token);
                $http.defaults.headers.common["ANGHARAD_SESSION_ID"] = response.token;
                $rootScope.$broadcast("loginSuccess");
                $scope.isLogged = true;
                $location.path("/");
                toaster.pop({type: "success", title: "Login success"});
            },
            function (error) {
                toaster.pop({type: "error", title: "Login error"});
            });
      };
      
      self.init();
  }
);
