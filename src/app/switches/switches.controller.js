angular.module('sagremorApp')
    .controller('switchesCtrl', [
    '$scope',
    'benoicFactory',
    'sharedData',
    function($scope, benoicFactory, sharedData) {
      
        var self = this;
        
        this.switchList = [];
        this.dimmerList = [];
        
        this.init = function () {
            self.updateSwitchers();
        };
        
        $scope.$on('benoicDevicesChanged', function () {
            self.updateSwitchers();
            self.updateDimmers();
        });
        
        $scope.$on('benoicSwitchesChanged', function () {
            self.updateSwitchers();
            self.updateDimmers();
        });
        
        this.updateSwitchers = function () {
            var devices = sharedData.all('benoicDevices');
            for (key in devices) {
                var deviceName = devices[key].name;
                if (devices[key].connected && devices[key].enabled) {
                    for (sw in devices[key].element.switches) {
                        var switcher = devices[key].element.switches[sw];
                        switcher.device = deviceName;
                        switcher.name = sw;
                        self.switchList.push(switcher);
                    }
                }
            }
        };
        
        this.updateDimmers = function () {
            var devices = sharedData.all('benoicDevices');
            for (key in devices) {
                var deviceName = devices[key].name;
                if (devices[key].connected && devices[key].enabled) {
                    for (di in devices[key].element.dimmers) {
                        var dimmer = devices[key].element.dimmers[di];
                        dimmer.device = deviceName;
                        dimmer.name = di;
                        self.dimmerList.push(dimmer);
                    }
                }
            }
        };
          
        this.init();
    }
]);