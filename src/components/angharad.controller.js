angular.module('sagremorApp')
  .controller('angharadCtrl', [
  '$scope',
  '$http',
  '$q',
  '$location',
  '$cookieStore',
  'angharadFactory',
  'benoicFactory',
  'sharedData',
  function($scope, $http, $q, $location, $cookieStore, angharadFactory, benoicFactory, sharedData) {
    var self = this;
    
    function init() {
      self.getAuth()
        .then(function() {
          self.initBenoicDeviceTypes().then(function() {
              self.initBenoicElements();
          });
        });
    }
    
    this.getAuth = function() {
      $http.defaults.headers.common["ANGHARAD_SESSION_ID"] = $cookieStore.get("ANGHARAD_SESSION_ID");

      return angharadFactory.getAuth()
        .then(function(response) {
          if ($location.url() === "/login") {
              $location.path("/");
              self.init();
          }
        },
        function(error) {
          if (error.status === 401) {
            $location.path("/login");
          }
          return $q.reject(error);
        });
    };
    
    this.logout = function() {
      angharadFactory.deleteAuth()
        .then(function(response) {
          $scope.isLogged = false;
          $location.path("/login");
          $http.defaults.headers.common["ANGHARAD_SESSION_ID"] = "";
        });
    };
    
    this.initBenoicElements = function() {
        benoicFactory.getDeviceList()
        .then(function(response) {
            var deviceList = [];
            var deviceListName = [];
            for (index in response) {
                if (response[index].connected) {
                    deviceList.push(benoicFactory.getDeviceOverview(response[index].name));
                    deviceListName.push(response[index].name);
                }
                sharedData.add('benoicDevices', response[index].name, response[index]);
            }
            $q.all(deviceList).then(function (responses) {
                for (index in responses) {
                    var curDevice = sharedData.get('benoicDevices', deviceListName[index]);
                    curDevice.element = responses[index];
                }
                $scope.$broadcast('benoicDevicesChanged');
            });
        });
    };
    
    this.initBenoicDeviceTypes = function () {
          return benoicFactory.getDeviceTypes().then(function (response) {
              _.forEach(response, function (type) {
                  sharedData.add('benoicDeviceTypes', type.name, type);
              });
              $scope.$broadcast('benoicDevicesTypesChanged');
          });
    };
    
    init();
  }
]);
