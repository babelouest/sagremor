angular.module('sagremorApp')
    .controller('switchesCtrl', [
    '$scope',
    'benoicFactory',
    'sharedData',
    function($scope, benoicFactory, sharedData) {
      
        var self = this;
        
        this.switchList = [];
        
        this.init = function () {
        };
        
        $scope.$on('benoicDevicesChanged', function () {
            var devices = sharedData.all('benoicDevices');
            for (key in devices) {
                var deviceName = devices[key].name;
                for (sw in devices[key].element.switches) {
                    var switcher = devices[key].element.switches[sw];
                    switcher.device = deviceName;
                    switcher.name = sw;
                    self.switchList.push(switcher);
                }
            }
        });
          
        this.init();
    }
]);
