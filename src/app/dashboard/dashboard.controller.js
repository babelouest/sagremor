angular.module('sagremorApp')
    .controller('DashboardCtrl', 
    function($scope, $location, $translate, $timeout, sharedData, sagremorParams, sagremorService, benoicFactory, carleonFactory, sagGenericInjectorManager) {
      
        var self = this;
        self.sagGenericInjectorManager = sagGenericInjectorManager;
        
        this._timeout = null;
        
        this.init = function () {
            self.dashboardWidgets = [];
            getDashboardElements();
			$translate(["remove_from_dashboard"]).then(function (results) {
				self.menu = [
					{
						name: "remove_from_dashboard", 
						display: results.remove_from_dashboard, 
						action: function (param) {
							removeFromDashboard(param);
						}
					}
				];
            });
		};
        
        function getDashboardElements () {
            self.dashboardWidgets = [];
            getDashboardElementsAllProfiles();
            getDashboardElementsCurrentProfiles();
        }
        
        function getDashboardElementsAllProfiles () {
            var devices = sharedData.all('benoicDevices');
            _.forEach(devices, function (device, deviceName) {
                _.forEach(device.element.switches, function(switcher, name) {
                    _.forEach(switcher.options.tags, function (tag) {
                        if (tag.indexOf("SGMR$D") === 0) {
                            switcher.type = 'switch';
                            switcher.device = deviceName;
                            switcher.name = name;
                            switcher.profile = "all";
                            addBenoicElementToDashboard(switcher, tag);
                        }
                    });
                });

                _.forEach(device.element.dimmers, function(dimmer, name) {
                    _.forEach(dimmer.options.tags, function (tag) {
                        if (tag.indexOf("SGMR$D") === 0) {
                            dimmer.type = 'dimmer';
                            dimmer.device = deviceName;
                            dimmer.name = name;
                            dimmer.profile = "all";
                            addBenoicElementToDashboard(dimmer, tag);
                        }
                    });
                });

                _.forEach(device.element.sensors, function(sensor, name) {
                    _.forEach(sensor.options.tags, function (tag) {
                        if (tag.indexOf("SGMR$D") === 0) {
                            sensor.type = 'sensor';
                            sensor.device = deviceName;
                            sensor.name = name;
                            sensor.profile = "all";
                            addBenoicElementToDashboard(sensor, tag);
                        }
                    });
                });

                _.forEach(device.element.heaters, function(heater, name) {
                    _.forEach(heater.options.tags, function (tag) {
                        if (tag.indexOf("SGMR$D") === 0) {
                            heater.type = 'heater';
                            heater.device = deviceName;
                            heater.name = name;
                            heater.profile = "all";
                            addBenoicElementToDashboard(heater, tag);
                        }
                    });
                });
            });
            
            var services = sharedData.all('carleonServices');
            _.forEach(services, function (service) {
                _.forEach(service.element, function(element) {
                    _.forEach(element.tags, function (tag) {
                        if (tag.indexOf("SGMR$D") === 0) {
                            element.type = service.name;
                            element.uid = service.uid;
                            element.profile = "all";
                            addCarleonElementToDashboard(element, tag);
                        }
                    });
                });

			});
        }
        
        function getDashboardElementsCurrentProfiles() {
            var profile = sagremorParams.currentProfile;
            if (!!profile && !!profile.addTo && !!profile.addTo.D) {
                _.forEach(profile.addTo.D, function (element) {
					element.profile = "current";
                    if (!!element.device) {
                        element.tag = "SGMR$D$" + element.x + "$" + element.y;
                        addBenoicElementToDashboard(element, element.tag);
                    } else {
                        element.tag = "SGMR$D$" + element.x + "$" + element.y;
                        addCarleonElementToDashboard(element, element.tag);
                    }
                });
            }
        }
        
        function addBenoicElementToDashboard(element, tag) {
            var tagParams = tag.split("$");
            if (tagParams.length >= 4) {
                var x = tagParams[2];
                var y = tagParams[3];
                var curHeight = 1;
                if (element.type === "dimmer" || element.type === "heater") {
                    curHeight = 2;
                }
                var dashboardElement = { type: element.type, device: element.device, name: element.name, element: element, x: x, y: y, width: 2, height: curHeight, tag: tag };
                self.dashboardWidgets.push(dashboardElement);
            }
        }
        
        function addCarleonElementToDashboard(element, tag) {
            var tagParams = tag.split("$");
            if (tagParams.length >= 4) {
                var x = tagParams[2];
                var y = tagParams[3];
                var curHeight = 3;
                var dashboardElement = { type: element.type, uid: element.uid, name: element.name, element: element, x: x, y: y, width: 2, height: curHeight, tag: tag };
                self.dashboardWidgets.push(dashboardElement);
            }
        }
        
        this.options = {
            cellHeight: 100,
            verticalHargin: 10
        };
        
        function removeFromDashboard(w) {
            if (!!w.element.device) {
                benoicFactory.removeTag(w.element.device, w.element.type, w.element.name, w.tag).then(function () {
                    var index = self.dashboardWidgets.indexOf(w);
                    self.dashboardWidgets.splice(index, 1);
                });
            } else {
                carleonFactory.removeTag(w.element.uid, w.element.name, w.tag).then(function () {
                    var index = self.dashboardWidgets.indexOf(w);
                    self.dashboardWidgets.splice(index, 1);
                });
            }
        };

        $scope.onChange = function(event, items) {
            if(self._timeout) { // if there is already a timeout in process cancel it
                $timeout.cancel(self._timeout);
            }
            self._timeout = $timeout(function() {
                _.forEach(items, function (item) {
                    var element = _.find(self.dashboardWidgets, function (widget) {
                        return widget.type === $(item.el).attr('data-sag-type') &&
                                widget.name === $(item.el).attr('data-sag-name') &&
                                (!widget.device || widget.device === $(item.el).attr('data-sag-device')) &&
                                (!widget.uid || widget.uid === $(item.el).attr('data-sag-uid'));
                    });
                    if (!!element) {
						var newTag = "SGMR$D$" + item.x + "$" + item.y;
						updateTag(element, newTag);
                    }
                });
                self._timeout = null;
            }, 500);
        };
        
        function updateTag(element, newTag) {
            if (newTag !== element.tag) {
				if (element.profile === "all") {
					if (!!element.device) {
						benoicFactory.removeTag(element.device, element.type, element.name, element.tag).then(function () {
							benoicFactory.addTag(element.device, element.type, element.name, newTag).then(function () {
								element.tag = newTag;
							});
						});
					} else {
						carleonFactory.removeTag(element.uid, element.name, element.tag).then(function () {
							carleonFactory.addTag(element.uid, element.name, newTag).then(function () {
								element.tag = newTag;
							});
						});
					}
				} else {
					var splitted = newTag.split("$");
					element.x = splitted[2];
					element.y = splitted[3];
				}
            }
        }
        
        $scope.$on("refreshDashboard", function () {
            getDashboardElements();
        });
        
        $scope.$on('benoicDevicesChanged', function () {
            getDashboardElements();
        });
            
        this.init();
        
});
