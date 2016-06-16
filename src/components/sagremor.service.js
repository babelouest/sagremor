angular.module('sagremorApp')
    .factory('sagremorService', 
    function($uibModal, toaster, sagremorParams, benoicFactory, carleonFactory) {
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
        
        sagremorFactory.addToDashboard = function (element, allProfiles) {
            // add tag
            var promise = null;
            var tag = "SGMR$D$0$0";
			if (allProfiles) {
				if (!!element.device) {
                    promise = benoicFactory.addTag(element.device, element.type, element.name, tag);
				} else {
                    promise = carleonFactory.addTag(element.uid, element.name, tag);
				}
                promise.then(function () {
                    if (!element.tags) {
                        element.tags = [];
                    }
                    element.tags.push(tag);
                    toaster.pop({type: 'success', title: $translate.instant('angharad_add_to_dashboard'), body: $translate.instant('angharad_add_to_dashboard_success')});
                }, function () {
                    toaster.pop({type: 'error', title: $translate.instant('angharad_add_to_dashboard'), body: $translate.instant('angharad_add_to_dashboard_error')});
                });
			} else {
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
                        x: 0,
                        y: 0
                    };
                    profile.addTo.D.push(newElement);
                } else {
                    var newElement = {
                        uid: element.uid,
                        type: element.service,
                        name: element.name,
                        x: 0,
                        y: 0
                    };
                    profile.addTo.D.push(newElement);
                }
                carleonFactory.setProfile(profile.name, profile).then(function () {
                    toaster.pop({type: 'success', title: $translate.instant('angharad_add_to_dashboard'), body: $translate.instant('angharad_add_to_dashboard_success')});
                }, function () {
                    toaster.pop({type: 'error', title: $translate.instant('angharad_add_to_dashboard'), body: $translate.instant('angharad_add_to_dashboard_error')});
                });
			}
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
    
		return sagremorFactory;
	}
);
