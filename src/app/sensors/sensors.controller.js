angular.module('sagremorApp')
    .controller('sensorsCtrl', [
    '$scope',
    '$location',
    '$translate',
    'sagremorService',
    'benoicFactory',
    'sharedData',
    'sagremorParams',
    function($scope, $location, $translate, sagremorService, benoicFactory, sharedData, sagremorParams) {
      
        var self = this;
        
        this.sensorList = [];
        this.sagremorParams = sagremorParams;
        
        this.init = function () {
			if (!sagremorParams.loggedIn) {
				$location.path("/login");
			}
			$translate(["edit", "monitor", "add_to_dashboard_current_profile", "add_to_dashboard_all_profiles"]).then(function (results) {
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
					},
					{
						name: "add_to_dashboard_current_profile", 
						display: results.add_to_dashboard_current_profile, 
						action: function (param) {
							if (sagremorService.addToDashboard(param, false)) {
                                $scope.$broadcast("refreshDashboard");
                            }
						}
					},
					{
						name: "add_to_dashboard_all_profiles", 
						display: results.add_to_dashboard_all_profiles, 
						action: function (param) {
							if (sagremorService.addToDashboard(param, true)) {
                                $scope.$broadcast("refreshDashboard");
                            }
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
