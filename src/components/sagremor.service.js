angular.module('sagremorApp')
    .factory('sagremorService', 
    function($uibModal, $translate, toaster, sharedData, sagremorParams, benoicFactory, carleonFactory) {
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
        
        sagremorFactory.addToDashboard = function (element) {
            // add tag
            var tag = "SGMR$D$0$0";
			var profile = sagremorParams.currentProfile;
			if (!profile.addTo) {
				profile.addTo = {};
			}
			if (!profile.addTo.D) {
				profile.addTo.D = [];
			}
			if (!!element.device) {
				var newElement = {
					device: element.device,
					type: element.type,
					name: element.name,
					tag: tag
				};
				profile.addTo.D.push(newElement);
			} else {
				var newElement = {
					uid: element.uid,
					type: element.type,
					name: element.name,
					tag: tag
				};
				profile.addTo.D.push(newElement);
			}
			carleonFactory.setProfile(profile.name, profile).then(function () {
				toaster.pop({type: 'success', title: $translate.instant('angharad_add_to_dashboard'), body: $translate.instant('angharad_add_to_dashboard_success')});
			}, function () {
				toaster.pop({type: 'error', title: $translate.instant('angharad_add_to_dashboard'), body: $translate.instant('angharad_add_to_dashboard_error')});
			});
            return true;
        };
        
        sagremorFactory.removeFromDashboard = function (element) {
            var dashboardWidgets = sagremorParams.dashboardWidgets;
            if (dashboardWidgets !== undefined) {
                _.remove(dashboardWidgets, function(widget) {
                    return (widget.type === element.type && widget.element.device === element.device && widget.element.name === element.name);
                });
            }
            sagremorParams.dashboardWidgets = dashboardWidgets;
            return true;
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
		
		sagremorFactory.editScript = function (script) {
			var modalInstance = $uibModal.open({
				animation: true,
				templateUrl: 'components/script/script.modal.html',
				controller: 'ScriptModalCtrl',
				controllerAs: 'ScriptModalCtrl',
				size: 'sm',
				resolve: {
					script: function () {
						return script;
					}
				}
			});
		};
		
		sagremorFactory.getBenoicElement = function (device, type, name) {
			var elements = sharedData.get("benoicDevices", device);
			if (!!elements) {
				switch (type) {
					case "switch":
						if (elements.element.switches[name]) {
							return elements.element.switches[name];
						}
						break;
					case "dimmer":
						if (elements.element.dimmers[name]) {
							return elements.element.dimmers[name];
						}
						break;
					case "heater":
						if (elements.element.heaters[name]) {
							return elements.element.heaters[name];
						}
						break;
					case "sensor":
						if (elements.element.sensors[name]) {
							return elements.element.sensors[name];
						}
						break;
				}
			}
			return false;
		};
		
		sagremorFactory.getCarleonElement = function (service, name) {
			var service = sharedData.get("carleonServices", service);
			if (!!service) {
				var element = _.find(service.element, function(elt) {
					return elt.name === name;
				});
				return element||false;
			}
			return false;
		};
    
		return sagremorFactory;
	}
);
