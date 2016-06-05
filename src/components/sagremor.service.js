angular.module('sagremorApp')
    .factory('sagremorService', [
    '$uibModal',
    function($uibModal) {
		var sagremorFactory = {};
		
		sagremorFactory.monitor = function (element) {
			var modalInstance = $uibModal.open({
				animation: true,
				templateUrl: 'components/monitor/monitor.modal.html',
				controller: 'MonitorModalCtrl',
				controllerAs: 'MonitorModalCtrl',
				size: 'sm',
				resolve: {
					element: function () {
						return element;
					}
				}
			});
		};
		
		sagremorFactory.editSwitcher = function (switcher) {
			var modalInstance = $uibModal.open({
				animation: true,
				templateUrl: 'components/switch/switch.modal.html',
				controller: 'SwitchesModalCtrl',
				controllerAs: 'SwitchesModalCtrl',
				size: 'sm',
				resolve: {
					switcher: function () {
						return switcher;
					}
				}
			});
		};
		
		sagremorFactory.editSensor = function (sensor) {
			var modalInstance = $uibModal.open({
				animation: true,
				templateUrl: 'components/sensor/sensor.modal.html',
				controller: 'SensorsModalCtrl',
				controllerAs: 'SensorsModalCtrl',
				size: 'sm',
				resolve: {
					sensor: function () {
						return sensor;
					}
				}
			});
		};
		
		sagremorFactory.editHeater = function (heater) {
			var modalInstance = $uibModal.open({
				animation: true,
				templateUrl: 'components/heater/heater.modal.html',
				controller: 'HeatersModalCtrl',
				controllerAs: 'HeatersModalCtrl',
				size: 'sm',
				resolve: {
					heater: function () {
						return heater;
					}
				}
			});
		};
		
		sagremorFactory.editDimmer = function (dimmer) {
			var modalInstance = $uibModal.open({
				animation: true,
				templateUrl: 'components/dimmer/dimmer.modal.html',
				controller: 'DimmersModalCtrl',
				controllerAs: 'DimmersModalCtrl',
				size: 'sm',
				resolve: {
					dimmer: function () {
						return dimmer;
					}
				}
			});
		};
    
		return sagremorFactory;
	}
]);
