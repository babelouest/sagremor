angular.module("sagremorApp")
    .controller("DashboardCtrl", 
    function($scope, $location, $translate, $timeout, toaster, sharedData, sagremorParams, sagremorService, sagremorEdit, benoicFactory, carleonFactory) {

        var self = this;

		this._timeout = null;
		this.sagremorParams = sagremorParams;
		
        this.options = {
            cellHeight: 100,
            verticalHargin: 10
        };
        
        this.init = function () {
            self.dashboardWidgets = [];
            getDashboardElements();
			self.menu = [
				{
					name: "remove_from_dashboard", 
					display: $translate.instant("remove_from_dashboard"), 
					action: function (param) {
						removeFromDashboard(param);
					}
				}
			];
		};
		
		this.addTitleLine = function () {
			return sagremorEdit.open($translate.instant("dashboard_add_line"), $translate.instant("dashboard_add_line_value")).then(function (result) {
				newDashboardSeparator(result.value);
			});
		};

        function getDashboardElements () {
            self.dashboardWidgets = [];
            getDashboardElementsCurrentProfiles();
        }

        function getDashboardElementsCurrentProfiles() {
            var profile = sagremorParams.currentProfile;
            if (!!profile && !!profile.addTo && !!profile.addTo.D) {
                _.forEach(profile.addTo.D, function (element) {
                    if (!!element.device) {
                        addBenoicElementToDashboard(element, element.tag);
					} else if (element.type === "script") {
						addScriptToDashboard(element, element.tag);
					} else if (element.type === "scheduler") {
						addSchedulerToDashboard(element, element.tag);
                    } else {
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
					var curHeight = 2;
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
            var tagParams = tag.split("$");
            if (tagParams.length >= 4) {
                var x = tagParams[2];
                var y = tagParams[3];
                var curHeight = 2;
                var dashboardElement = { type: element.type, name: element.name, element: element, x: x, y: y, width: 2, height: curHeight, tag: tag };
                self.dashboardWidgets.push(dashboardElement);
            }
        }
        
        function addDashboardSeparator(value, y) {
			
		}
		
		function newDashboardSeparator(value) {
		}
        
        function removeFromDashboard(w) {
            var profile = sagremorParams.currentProfile;
            if (!!profile && !!profile.addTo && !!profile.addTo.D) {
                _.forEach(profile.addTo.D, function (element, key) {
					if (element && element.type === w.element.type && element.name === w.element.name && w.tag === element.tag) {
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
			if(self._timeout) { // if there is already a timeout in process cancel it
				$timeout.cancel(self._timeout);
			}
            self._timeout = $timeout(function() {
				_.forEach(items, function (item) {
					var element = _.find(self.dashboardWidgets, function (widget) {
						return widget.type === $(item.el).attr("data-sag-type") &&
								widget.name === $(item.el).attr("data-sag-name") &&
								(!widget.device || widget.device === $(item.el).attr("data-sag-device")) &&
								(!widget.uid || widget.uid === $(item.el).attr("data-sag-uid"));
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
				var profile = sagremorParams.currentProfile;
				if (!!profile && !!profile.addTo && !!profile.addTo.D) {
					var elt = _.find(profile.addTo.D, function (e) {
						return element.tag == e.tag;
					});
					if (elt) {
						elt.tag = newTag;
						carleonFactory.setProfile(sagremorParams.currentProfile.name, sagremorParams.currentProfile).then(function () {
							toaster.pop("success", $translate.instant("profile_save"), $translate.instant("profile_save_success"));
						}, function () {
							toaster.pop("error", $translate.instant("profile_save"), $translate.instant("profiles_save_error"));
						});
					}
				}
            }
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
