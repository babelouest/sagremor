angular.module("sagremorApp")
    .controller("DashboardCtrl", 
    function($scope, $location, $translate, $timeout, toaster, sharedData, sagremorParams, sagremorService, sagremorEdit, benoicFactory, carleonFactory, sagGenericInjectorManager) {

        var self = this;

		this._timeout = null;
		this.sagremorParams = sagremorParams;
		this.profileName = "";
		
        this.options = {
            cellHeight: 100,
            verticalHargin: 10,
            disableResize: false
        };
        
        this.init = function () {
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
            if (!!sagremorParams.currentProfile) {
				getDashboardElementsCurrentProfiles();
			} else {
				getDashboardElementsNoProfile();
			}
        }
        
        function getDashboardElementsNoProfile () {
			// Carleon not enabled, adding all benoic elements to the dashboard (if enabled)
			if (sagremorParams.benoicEnabled) {
				var defaultTag = "SGMR$D$";
				var defaultY = 0;
				
				var x = 0;
				_.forEach(sharedData.all("benoicDevices"), function (device) {
					if (!!device.element) {
						_.forEach(device.element.sensors, function (element, name) {
							element.type = "sensor";
							element.device = device.name;
							element.name = name;
							addBenoicElementToDashboard(element, defaultTag + x + "$" + defaultY);
							x += 2;
						});
					}
				});
				addDashboardSeparator($translate.instant("sensors_title"), defaultTag + x + "$" + defaultY);
				
				var x = 0;
				_.forEach(sharedData.all("benoicDevices"), function (device) {
					if (!!device.element) {
						_.forEach(device.element.heaters, function (element, name) {
							element.type = "heater";
							element.device = device.name;
							element.name = name;
							addBenoicElementToDashboard(element, defaultTag + x + "$" + defaultY);
							x += 2;
						});
					}
				});
				addDashboardSeparator($translate.instant("heaters_title"), defaultTag + x + "$" + defaultY);;
				
				var x = 0;
				_.forEach(sharedData.all("benoicDevices"), function (device) {
					if (!!device.element) {
						_.forEach(device.element.dimmers, function (element, name) {
							element.type = "dimmer";
							element.device = device.name;
							element.name = name;
							addBenoicElementToDashboard(element, defaultTag + x + "$" + defaultY);
							x += 2;
						});
					}
				});
				var x = 0;
				_.forEach(sharedData.all("benoicDevices"), function (device) {
					if (!!device.element) {
						_.forEach(device.element.switches, function (element, name) {
							element.type = "switch";
							element.device = device.name;
							element.name = name;
							addBenoicElementToDashboard(element, defaultTag + x + "$" + defaultY);
							x += 2;
						});
					}
				});
				addDashboardSeparator($translate.instant("switches_title"), defaultTag + x + "$" + defaultY);
				
			}
		}

        function getDashboardElementsCurrentProfiles () {
            var profile = sagremorParams.currentProfile;
			if (!!profile && !!profile.addTo && !!profile.addTo.D) {
				self.profileName = profile.name;
				_.forEach(profile.addTo.D, function (element) {
					if (!!element.device) {
						if (sagremorParams.benoicEnabled) {
							addBenoicElementToDashboard(element, element.tag);
						}
					} else if (element.type === "script") {
						addScriptToDashboard(element, element.tag);
					} else if (element.type === "scheduler") {
						addSchedulerToDashboard(element, element.tag);
					} else if (element.type === "separator") {
						addDashboardSeparator(element.name, element.tag);
					} else if (sagremorParams.carleonEnabled) {
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
                var bElt = sagremorService.getBenoicElement(element.device, element.type, element.name);
                bElt.device = element.device;
                bElt.name = element.name;
                var dashboardElement = { type: element.type, device: element.device, name: element.name, element: bElt, x: x, y: y, width: 2, height: curHeight, tag: tag };
                self.dashboardWidgets.push(dashboardElement);
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
					var dashboardElement = { type: element.type, name: element.name, element: elt, x: x, y: y, width: 2, height: curHeight, tag: tag };
					self.dashboardWidgets.push(dashboardElement);
				}
			}
		}
        
        function addSchedulerToDashboard(element, tag) {
			var elt = sharedData.get("angharadSchedulers", element.name);
			if (!!elt) {
				var tagParams = tag.split("$");
				if (tagParams.length >= 4) {
					var x = tagParams[2];
					var y = tagParams[3];
					var curHeight = 2;
					var dashboardElement = { type: element.type, name: element.name, element: elt, x: x, y: y, width: 2, height: curHeight, tag: tag };
					self.dashboardWidgets.push(dashboardElement);
				}
			}
		}
        
        function addCarleonElementToDashboard(element, tag) {
			var injector = _.find(sagGenericInjectorManager.components, function (inject) {
				return inject.type === element.type;
			});
            var tagParams = tag.split("$");
            if (tagParams.length >= 4) {
                var x = tagParams[2];
                var y = tagParams[3];
                var curHeight = injector.widgetHeight;
                var dashboardElement = { type: element.type, name: element.name, element: element, x: x, y: y, width: 2, height: curHeight, tag: tag };
                self.dashboardWidgets.push(dashboardElement);
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
			var dashboardElement = { type: "separator", name: value, x: 0, y: 0, width: 10, height: 1 };
			var profile = sagremorParams.currentProfile;
			if (!profile.addTo) {
				profile.addTo = {D: []};
			}
			if (!profile.addTo.D) {
				profile.addTo.D = [];
			}
			self.dashboardWidgets.push(dashboardElement);
			var newElement = {
				type: "separator",
				name: value,
				tag: "SGMR$D$0$0"
			};
			profile.addTo.D.push(newElement);
			carleonFactory.setProfile(profile.name, profile).then(function () {
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
			var index = self.dashboardWidgets.indexOf(w);
			self.dashboardWidgets.splice(index, 1);
			sagremorParams.currentProfile = profile;
			carleonFactory.setProfile(profile.name, profile).then(function () {
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
				if (sagremorParams.carleonEnabled) {
					var changed = false;
					_.forEach(items, function (item) {
						var element = _.find(self.dashboardWidgets, function (widget) {
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
						var dashboardWidgets = _(sagremorParams.currentProfile.addTo.D).chain().sortBy(function (widget) {
							var splitted = widget.tag.split("$");
							return splitted[2];
						}).sortBy(function (widget) {
							var splitted = widget.tag.split("$");
							return splitted[3];
						}).value();
						sagremorParams.currentProfile.addTo.D = dashboardWidgets;
						
						carleonFactory.setProfile(sagremorParams.currentProfile.name, sagremorParams.currentProfile).then(function () {
							toaster.pop("success", $translate.instant("profile_save"), $translate.instant("profile_save_success"));
						}, function () {
							toaster.pop("error", $translate.instant("profile_save"), $translate.instant("profiles_save_error"));
						});
					}
				}
				self._timeout = null;
			}, 500);
        };
        
        function updateTag(element, newTag) {
            if (newTag !== element.tag) {
				var profile = sagremorParams.currentProfile;
				if (!profile.addTo) {
					profile.addTo = {D: []};
				}
				if (!profile.addTo.D) {
					profile.addTo.D = [];
				}
				if (!!profile) {
					var elt = _.find(profile.addTo.D, function (e) {
						return element.tag == e.tag;
					});
					if (!!elt) {
						elt.tag = newTag;
						return true;
					}
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
            getDashboardElements();
        });
        
        $scope.$on("refreshDashboard", function () {
            getDashboardElements();
        });
        
        $scope.$on("benoicDevicesChanged", function () {
            getDashboardElements();
        });
        
        $scope.$on("carleonServicesChanged", function () {
            getDashboardElements();
        });
        
        this.init();
        
});
