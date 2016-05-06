angular.module('angharadApp')
  .controller('angharadCtrl', [
  '$scope',
  '$http',
  '$location',
  '$cookies',
  'angharadFactory',
  'benoicFactory',
  function($scope, $http, $location, $cookies, angharadFactory, benoicFactory) {
    $scope.submodules = [];
    
    $scope.devices = [];
    $scope.elements = {switches: [], dimmers: [], heaters: [], sensors: []};
    
    var self = this;
    
    function init() {
      $scope.isLogged = false;
      self.getAuth();
    }
    
    this.initAngharad = function () {
      angharadFactory.getSumboduleList()
        .then(function(response) {
          $scope.submodules = response.data;
        });
      
      benoicFactory.getDeviceList()
        .then(function(response) {
          $scope.devices = response.data;
          var benoic = _.find($scope.submodules, {"name": "benoic"});
          if (benoic && benoic.enabled) {
            
            _.forEach($scope.devices, function(device) {
              benoicFactory.getDeviceOverview(device.name)
                .then(function(response) {
                  for (name in response.data.switches) {
                    response.data.switches[name].name = name;
                    response.data.switches[name].device = device.name;
                    $scope.elements.switches.push(response.data.switches[name]);
                  }
                });
            });
          }
        });
    };
    
    this.getAuth = function() {
      $http.defaults.headers.common["ANGHARAD_SESSION_ID"] = $cookies.get("ANGHARAD_SESSION_ID");
        
      console.log("cookie", $http.defaults.headers);
      angharadFactory.getAuth()
        .then(function(response) {
          $scope.isLogged = true;
          console.log("auth response", response);
        },
        function(error) {
          if (error.status === 401) {
            $location.path("/login");
          }
        });
    };
    
    init();
  }
]);
