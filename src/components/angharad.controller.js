angular.module('angharadApp')
  .controller('angharadCtrl', [
  '$scope',
  '$http',
  'angharadFactory',
  'benoicFactory',
  function($scope, $http, angharadFactory, benoicFactory) {
    $scope.submodules = [];
    
    $scope.devices = [];
    $scope.elements = {switches: [], dimmers: [], heaters: [], sensors: []};
    
    function init() {
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
    }
    
    init();
  }
]);
