angular.module('sagremorApp')
    .controller('heatersCtrl',
    function($scope, $location, $translate, sagremorService, benoicFactory, sharedData, sagremorParams) {
      
        var self = this;
        
        this.heaterList = [];
        this.sagremorParams = sagremorParams;
        
        this.init = function () {
			if (!sagremorParams.loggedIn) {
				$location.path("/login");
			}
			$translate(["edit", "monitor", "add_to_dashboard"]).then(function (results) {
				self.menuSensor = [
					{
						name: "edit", 
						display: results.edit, 
						action: function (param) {
							sagremorService.editHeater(param);
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
						name: "add_to_dashboard", 
						display: results.add_to_dashboard, 
						action: function (param) {
							if (sagremorService.addToDashboard(param, false)) {
                                $scope.$broadcast("refreshDashboard");
                            }
						}
					}
				];
				
				self.updateHeaters();
			});
		};
        
        $scope.$on('benoicDevicesChanged', function () {
            self.updateHeaters();
        });
        
        $scope.$on('benoicHeatersChanged', function () {
            self.updateHeaters();
        });
        
        this.updateHeaters = function () {
            var devices = sharedData.all('benoicDevices');
            for (key in devices) {
                var deviceName = devices[key].name;
                if (devices[key].connected && devices[key].enabled) {
                    for (se in devices[key].element.heaters) {
                        var heaters = devices[key].element.heaters[se];
                        heaters.device = deviceName;
                        heaters.name = se;
                        self.heaterList.push(heaters);
                    }
                }
            }
        };
        
        this.init();
        
    }
);
