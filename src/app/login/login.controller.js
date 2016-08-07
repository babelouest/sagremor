angular.module("sagremorApp")
  .controller("LoginCtrl",
  function($scope, $rootScope, $location, $cookies, $http, $translate, toaster, angharadFactory, sagremorParams) {
      
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
				sagremorParams.cookiesValidity = validity;
                $cookies.put("ANGHARAD_SESSION_ID", response.token, {expires: sagremorParams.cookiesValidity});
                $http.defaults.headers.common["ANGHARAD_SESSION_ID"] = response.token;
                $rootScope.$broadcast("loginSuccess");
                $scope.isLogged = true;
                $location.path("/");
                toaster.pop("success", $translate.instant("login_title"), $translate.instant("login_title_success"));
            },
            function (error) {
				toaster.pop("error", $translate.instant("login_title"), $translate.instant("login_title_error"));
            });
      };
      
      self.init();
  }
);
