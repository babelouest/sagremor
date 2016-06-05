angular.module('sagremorApp')
    .controller('sensorsCtrl', [
    '$scope',
    '$translate',
    'sagremorService',
    'benoicFactory',
    'sharedData',
    function($scope, $translate, sagremorService, benoicFactory, sharedData) {
      
        var self = this;
        
        this.sensorList = [];
        
        this.init = function () {
			$translate(["edit", "monitor"]).then(function (results) {
				self.menuSensor = [
					{
						name: "edit", 
						display: results.edit, 
						action: function (param) {
							sagremorService.editSensor(param);
						}
					},
					{
						name: "monitor", 
						display: results.monitor, 
						action: function (param) {
							sagremorService.monitor(param);
						}
					}
				];
				
				self.updateSensors();
			});
		};
        
        $scope.$on('benoicDevicesChanged', function () {
            self.updateSensors();
        });
        
        $scope.$on('benoicSensorsChanged', function () {
            self.updateSensors();
        });
        
        this.updateSensors = function () {
            var devices = sharedData.all('benoicDevices');
            for (key in devices) {
                var deviceName = devices[key].name;
                if (devices[key].connected && devices[key].enabled) {
                    for (se in devices[key].element.sensors) {
                        var sensors = devices[key].element.sensors[se];
                        sensors.device = deviceName;
                        sensors.name = se;
                        self.sensorList.push(sensors);
                    }
                }
            }
        };
        
        this.init();
        
    }
]);
