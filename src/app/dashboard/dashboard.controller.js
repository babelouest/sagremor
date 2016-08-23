angular.module("sagremorApp")
    .controller("DashboardCtrl", 
    function($scope, $location, $translate, $timeout, toaster, sharedData, sagremorParams, sagremorService, sagremorEdit, angharadFactory, benoicFactory, carleonFactory, sagGenericInjectorManager, carleonComponentsConfig) {

        var self = this;

		this._timeout = null;
		this.sagremorParams = sagremorParams;
		this.dashboardWidgets = [];
		this.dashboardWidgetsDisplay = [];
		this.profileName = "";
		this.isInit = true;
		
        this.options = {
            cellHeight: 100,
            verticalHargin: 10,
            disableResize: false
        };
        
        this.init = function () {
			self.isInit = true;
            getDashboardElements();
			self.menu = [
				{
					name: "remove_from_dashboard", 
					display: $translate.instant("remove_from_dashboard"), 
					action: function (param) {
						self.removeFromDashboard(param);
					}
				}
			];
		};
		
		this.menuSelect = function(menuItem, element) {
			menuItem.action(element);
		};
		
		this.addTitleLine = function () {
			return sagremorEdit.open($translate.instant("dashboard_add_line"), $translate.instant("dashboard_add_line_value")).then(function (result) {
				newDashboardSeparator(result.value);
			});
		};

        function getDashboardElements () {
            self.dashboardWidgets = [];
            self.dashboardWidgetsDisplay = [];
            if (!!sagremorParams.currentProfile && !!sagremorParams.currentProfile.addTo && !!sagremorParams.currentProfile.addTo.D && sagremorParams.currentProfile.addTo.D.length > 0) {
				getDashboardElementsCurrentProfile();
			} else {
				getDashboardElementsEmptyProfile();
			}
			for (key in self.dashboardWidgets) {
				if (!!self.dashboardWidgets[key]) {
					self.dashboardWidgetsDisplay.push(self.dashboardWidgets[key]);
				}
			}
        }
        
        function getDashboardElementsEmptyProfile () {
			var defaultTag = "SGMR$D$";
			var defaultY = 0;
			
			// adding all carleon elements to the dashboard (if enabled)
			if (sagremorParams.carleonEnabled) {
				_.forEach(sagGenericInjectorManager.components, function (component) {
					if (component.carleonService && carleonComponentsConfig[component.type].enabled) {
						var x = 0;
						var service = sharedData.get("carleonServices", component.type);
						!!service && _.forEach(service.element, function (element) {
							var curElement = {
								type: component.type,
								name: element.name
							};
							addCarleonElementToDashboard(curElement, defaultTag + x + "$" + defaultY);
							x += component.widgetWidth;
							x %= 12;
						});
						addDashboardSeparator($translate.instant(component.groupTitle), defaultTag + x + "$" + defaultY);
					}
				});
			}
			
			// adding all benoic elements to the dashboard (if enabled)
			if (sagremorParams.benoicEnabled) {
				
				var x = 0;
				var counter = 0;
				_.forEach(sharedData.all("benoicDevices"), function (device) {
					if (!!device.element) {
						_.forEach(device.element.sensors, function (element, name) {
							if (element.enabled) {
								element.type = "sensor";
								element.device = device.name;
								element.name = name;
								addBenoicElementToDashboard(element, defaultTag + x + "$" + defaultY);
								x += 3;
								x %= 12;
								counter++;
							}
						});
					}
				});
				if (counter >0) {
					addDashboardSeparator($translate.instant("sensors_title"), defaultTag + x + "$" + defaultY);
				}
				
				var x = 0;
				var counter = 0;
				_.forEach(sharedData.all("benoicDevices"), function (device) {
					if (!!device.element) {
						_.forEach(device.element.heaters, function (element, name) {
							if (element.enabled) {
								element.type = "heater";
								element.device = device.name;
								element.name = name;
								addBenoicElementToDashboard(element, defaultTag + x + "$" + defaultY);
								x += 3;
								x %= 12;
								counter++;
							}
						});
					}
				});
				if (counter >0) {
					addDashboardSeparator($translate.instant("heaters_title"), defaultTag + x + "$" + defaultY);;
				}
				
				var x = 0;
				var counter = 0;
				_.forEach(sharedData.all("benoicDevices"), function (device) {
					if (!!device.element) {
						_.forEach(device.element.dimmers, function (element, name) {
							if (element.enabled) {
								element.type = "dimmer";
								element.device = device.name;
								element.name = name;
								addBenoicElementToDashboard(element, defaultTag + x + "$" + defaultY);
								x += 3;
								x %= 12;
								counter++;
							}
						});
					}
				});
				var x = 0;
				_.forEach(sharedData.all("benoicDevices"), function (device) {
					if (!!device.element) {
						_.forEach(device.element.switches, function (element, name) {
							if (element.enabled) {
								element.type = "switch";
								element.device = device.name;
								element.name = name;
								addBenoicElementToDashboard(element, defaultTag + x + "$" + defaultY);
								x += 3;
								x %= 12;
								counter++;
							}
						});
					}
				});
				if (counter >0) {
					addDashboardSeparator($translate.instant("switches_title"), defaultTag + x + "$" + defaultY);
				}
			}
			self.isInit = false;
		}

        function getDashboardElementsCurrentProfile () {
            var profile = sagremorParams.currentProfile;
            if (!!profile) {
				self.profileName = profile.name;
			} else {
				self.profileName = "";
			}
			if (!!profile && !!profile.addTo && !!profile.addTo.D) {
				_.forEach(profile.addTo.D, function (element) {
					if (!!element.device) {
						if (sagremorParams.benoicEnabled) {
							addBenoicElementToDashboard(element, element.tag);
						}
					} else if (element.type === "script") {
						addScriptToDashboard(element, element.tag);
					} else if (element.type === "scheduler" || element.type === "trigger") {
						addEventToDashboard(element, element.tag);
					} else if (element.type === "separator") {
						addDashboardSeparator(element.name, element.tag);
					} else if (element.type === "monitor") {
						addMonitorToDashboard(element, element.tag);
					} else if (sagremorParams.carleonEnabled) {
						addCarleonElementToDashboard(element, element.tag);
					}
				});
			}
			self.isInit = false;
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
                var bElt = sagremorService.getBenoicElement(element.device, element.type, element.name);
                if (!!bElt) {
					var icon = "";
					switch (element.type) {
						case "switch":
							icon = "toggle-on";
							break;
						case "dimmer":
							icon = "lightbulb-o";
							break;
						case "heater":
							icon = "fire";
							break;
						case "sensor":
							icon = "line-chart";
							break;
					}
					bElt.device = element.device;
					bElt.name = element.name;
					var dashboardElement = { type: element.type, device: element.device, name: element.name, element: bElt, x: x, y: y, width: 2, height: curHeight, tag: tag, icon: icon };
					self.dashboardWidgets.push(dashboardElement);
				}
            }
        }
        
        function addScriptToDashboard(element, tag) {
			var elt = sharedData.get("angharadScripts", element.name);
			if (!!elt) {
				var tagParams = tag.split("$");
				if (tagParams.length >= 4) {
					var x = tagParams[2];
					var y = tagParams[3];
					var curHeight = 1;
					var icon = "tasks";
					var dashboardElement = { type: element.type, name: element.name, element: elt, x: x, y: y, width: 2, height: curHeight, tag: tag, icon: icon };
					self.dashboardWidgets[y * 10 + x] = dashboardElement;
				}
			}
		}
        
        function addEventToDashboard(element, tag) {
			var elt = false;
			var icon = "";
			if (element.type === "scheduler") {
				elt = sharedData.get("angharadSchedulers", element.name);
				icon = "calendar";
			} else {
				elt = sharedData.get("angharadTriggers", element.name);
				icon = "bell";
			}
			if (!!elt) {
				var tagParams = tag.split("$");
				if (tagParams.length >= 4) {
					var x = tagParams[2];
					var y = tagParams[3];
					var curHeight = element.type === "scheduler"?2:1;
					var dashboardElement = { type: element.type, name: element.name, element: elt, x: x, y: y, width: 2, height: curHeight, tag: tag, icon: icon };
					self.dashboardWidgets[y * 10 + x] = dashboardElement;
				}
			}
		}
        
        function addCarleonElementToDashboard(element, tag) {
			var injector = _.find(sagGenericInjectorManager.components, function (inject) {
				return inject.type === element.type && !!carleonComponentsConfig[inject.type] && !!carleonComponentsConfig[inject.type].enabled;
			});
			var service = sharedData.get("carleonServices", element.type);
			var elt = !!service && !!service.element && _.find(service.element, function (cElt) {
				return cElt.name === element.name;
			});
			if (!!elt) {
				var tagParams = tag.split("$");
				if (tagParams.length >= 4) {
					var x = tagParams[2];
					var y = tagParams[3];
					var curHeight = injector.widgetHeight;
					var curWidth = injector.widgetWidth;
					var icon= injector.icon;
					var dashboardElement = { type: element.type, name: element.name, element: element, x: x, y: y, width: curWidth, height: curHeight, tag: tag, icon: icon};
					self.dashboardWidgets[y * 10 + x] = dashboardElement;
				}
			}
        }
        
        function addMonitorToDashboard(element, tag) {
			var elt = _.find(sagremorParams.currentProfile.monitorList, function (monitor) {
				return monitor.name === element.name;
			});
			if (!!elt) {
				var tagParams = tag.split("$");
				if (tagParams.length >= 4) {
					var x = tagParams[2];
					var y = tagParams[3];
					var curHeight = 4;
					var icon = "bar-chart";
					var dashboardElement = { type: element.type, name: element.name, element: elt, x: x, y: y, width: 6, height: curHeight, tag: tag, icon: icon };
					self.dashboardWidgets[y * 10 + x] = dashboardElement;
				}
			}
		}
        
        function addDashboardSeparator(value, tag) {
            var tagParams = tag.split("$");
            if (tagParams.length >= 4) {
                var y = tagParams[3];
                var dashboardElement = { type: "separator", name: value, x: 0, y: y, width: 20, height: 1, tag: tag };
                self.dashboardWidgets.push(dashboardElement);
            }
		}
		
		function newDashboardSeparator(value) {
			var dashboardElement = { type: "separator", name: value, x: 0, y: self.dashboardWidgets[self.dashboardWidgets.length - 1].y + 1, width: 10, height: 1 };
			var profile = sagremorParams.currentProfile;
			if (!profile.addTo) {
				profile.addTo = {D: []};
			}
			if (!profile.addTo.D) {
				profile.addTo.D = [];
			}
			self.dashboardWidgetsDisplay.push(dashboardElement);
			var newElement = {
				type: "separator",
				name: value,
				tag: "SGMR$D$0$" + self.dashboardWidgets[self.dashboardWidgets.length - 1].y + 1
			};
			profile.addTo.D.push(newElement);
			angharadFactory.setProfile(profile.name, profile).then(function () {
				toaster.pop({type: "success", title: $translate.instant("angharad_add_to_dashboard"), body: $translate.instant("angharad_add_to_dashboard_success")});
			}, function () {
				toaster.pop({type: "error", title: $translate.instant("angharad_add_to_dashboard"), body: $translate.instant("angharad_add_to_dashboard_error")});
			});
		}
        
        this.removeFromDashboard = function (w) {
            var profile = sagremorParams.currentProfile;
            if (!!profile && !!profile.addTo && !!profile.addTo.D) {
                _.forEach(profile.addTo.D, function (element, key) {
					if (element && element.type === w.type && element.name === w.name && w.tag === element.tag) {
						profile.addTo.D.splice(key, 1);
					}
				});
			}
			var index = self.dashboardWidgetsDisplay.indexOf(w);
			self.dashboardWidgetsDisplay.splice(index, 1);
			sagremorParams.currentProfile = profile;
			angharadFactory.setProfile(profile.name, profile).then(function () {
				toaster.pop("success", $translate.instant("profile_save"), $translate.instant("profile_save_success"));
			}, function () {
				toaster.pop("error", $translate.instant("profile_save"), $translate.instant("profiles_save_error"));
			});
        };

        this.onChange = function(event, items) {
			if(self._timeout) {
				// if there is already a timeout in process cancel it
				$timeout.cancel(self._timeout);
			}
			self._timeout = $timeout(function() {
				if (!self.isInit) {
					if (sagremorParams.carleonEnabled) {
						var changed = false;
						_.forEach(items, function (item) {
							var element = _.find(self.dashboardWidgetsDisplay, function (widget) {
								return widget.type === $(item.el).attr("data-sag-type") &&
										widget.name === $(item.el).attr("data-sag-name") &&
										(!widget.device || widget.device === $(item.el).attr("data-sag-device"));
							});
							if (!!element) {
								var newTag = "SGMR$D$" + item.x + "$" + item.y;
								if (updateTag(element, newTag)) {
									changed = true;
									element.tag = newTag;
								}
							}
						});
						if (changed) {
							var dashboardWidgetsDisplay = _(sagremorParams.currentProfile.addTo.D).chain().sortBy(function (widget) {
								var splitted = widget.tag.split("$");
								return splitted[2];
							}).sortBy(function (widget) {
								var splitted = widget.tag.split("$");
								return splitted[3];
							}).value();
							sagremorParams.currentProfile.addTo.D = dashboardWidgetsDisplay;
							
							angharadFactory.setProfile(sagremorParams.currentProfile.name, sagremorParams.currentProfile).then(function () {
								toaster.pop("success", $translate.instant("profile_save"), $translate.instant("profile_save_success"));
							}, function () {
								toaster.pop("error", $translate.instant("profile_save"), $translate.instant("profiles_save_error"));
							});
						}
					}
				}
				self._timeout = null;
			}, 5000);
        };
        
        function updateTag(element, newTag) {
            if (newTag !== element.tag) {
				var profile = sagremorParams.currentProfile;
				if (!!profile) {
					if (!profile.addTo) {
						profile.addTo = {D: []};
					}
					if (!profile.addTo.D) {
						profile.addTo.D = [];
					}
					var elt = _.find(profile.addTo.D, function (e) {
						return element.tag == e.tag;
					});
					if (!!elt) {
						elt.tag = newTag;
					} else {
						element.tag = newTag;
						profile.addTo.D.push(element);
					}
					return true;
				}
            }
            return false;
        }
        
        function getProfileElementFromTag(tag) {
            var profile = sagremorParams.currentProfile;
            if (!!profile && !!profile.addTo && !!profile.addTo.D) {
                var elt = _.find(profile.addTo.D, function (element) {
					return element.tag == tag;
				});
				return elt||false;
			}
			return false;
		}
        
        $scope.$on("angharadProfileChanged", function () {
			self.isInit = true;
            getDashboardElements();
        });
        
        $scope.$on("refreshDashboard", function () {
			self.isInit = true;
            getDashboardElements();
        });
        
        $scope.$on("benoicDevicesChanged", function () {
			self.isInit = true;
            getDashboardElements();
        });
        
        $scope.$on("carleonServicesChanged", function () {
			self.isInit = true;
            getDashboardElements();
        });
        
        this.init();
        
});

/**
 * Workaround for using jquery 3 with gridstack (I F****ing hate bower !)
 */
$.fn.size = function(){
  return this.length;
};
