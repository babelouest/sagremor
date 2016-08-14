angular.module("sagremorApp")
  .controller("sagremorCtrl", 
  function($scope, $rootScope, $interval, $window, $http, $q, $location, $cookies, $translate, toaster, angharadFactory, benoicFactory, carleonFactory, garethFactory, sharedData, sagremorParams) {
    var self = this;
    
    this.loaderToast;
    this.initComplete = false;
    this.benoicInitError = false;
    this.shoudRefresh = false;
    this.hasFocus = true;
    this.refreshTimeout = null;
    
    function init() {
		$translate("angharad_loading_title").then(function (title) {
			// Nothing to do here, just waiting for lang files to be loaded before starting
		})["finally"](function () {
			initParameters();
			self.getAuth().then(function() {
				$rootScope.$broadcast("authChanged");
				popLoader();
				getApiData();
				self.refreshTimeout = startRefreshTimeout();
			});
		})
    }
    
    function closeLoader(result) {
        toaster.clear(self.loaderToast);
        if (result) {
            toaster.pop({type: "success", title: $translate.instant("angharad_loading_title"), body: $translate.instant("init_message_loading_complete")});
        } else {
            toaster.pop({type: "error", title: $translate.instant("angharad_loading_title"), body: $translate.instant("init_message_loading_error")});
        }
    }
    
    function popLoader() {
        self.loaderToast = toaster.pop({type: "wait", title: $translate.instant("angharad_loading_title"), body: $translate.instant("init_message_loading"), timeout: 0, showCloseButton: false});
    }
    
    function initParameters() {
        $http.defaults.headers.common["ANGHARAD_SESSION_ID"] = $cookies.get("ANGHARAD_SESSION_ID");
        sagremorParams.adminMode = false;
        sagremorParams.loggedIn = true;
    }
    
    function refreshData() {
		popLoader();
		
		// Refresh benoic devices with overview
		var devices = sharedData.all("benoicDevices");
		var devicePromises = {};
		_.forEach(sharedData.all("benoicDevices"), function (device, deviceName) {
			if (device.connected) {
				devicePromises[deviceName] = benoicFactory.getDeviceOverview(deviceName);
			}
		});
		$q.all(devicePromises).then(function (results) {
			_.forEach(results, function (element, name) {
				sharedData.get("benoicDevices", name).element = element;
			});
			$rootScope.$broadcast("refreshDevices");
		}, function (error) {
			toaster.pop("error", $translate.instant("refresh"), $translate.instant("refresh_device_error"));
		})["finally"](function () {
			// Refresh scripts and events
			var promiseList = {
				scripts: angharadFactory.getScriptList(),
				schedulers: angharadFactory.getSchedulerList(),
				triggers: angharadFactory.getTriggerList(),
				profiles: angharadFactory.getProfileList()
			};
			
			$q.all(promiseList).then(function (result) {
				sharedData.removeAll("angharadScripts");
				sharedData.removeAll("angharadSchedulers");
				sharedData.removeAll("angharadTriggers");
				for (sc in result.scripts) {
					sharedData.add("angharadScripts", result.scripts[sc].name, result.scripts[sc]);
				}
				$rootScope.$broadcast("refreshAngharadScripts");
				for (sh in result.schedulers) {
					sharedData.add("angharadSchedulers", result.schedulers[sh].name, result.schedulers[sh]);
				}
				for (tr in result.triggers) {
					sharedData.add("angharadTriggers", result.triggers[tr].name, result.triggers[tr]);
				}
				$rootScope.$broadcast("refreshAngharadEvents");
				sagremorParams.profiles = result;
				$scope.$broadcast("angharadProfileChanged");
			}, function (error) {
				toaster.pop("error", $translate.instant("refresh"), $translate.instant("refresh_scripts_events_error"));
			})["finally"](function () {
				// Refresh carleon services elements
				sharedData.removeAll("carleonServices");
				
				carleonFactory.getServiceList().then(function (result) {
					for (key in result) {
						_.forEach(result[key].element, function (element) {
							element.type = result[key].name;
						});
						sharedData.add("carleonServices", result[key].name, result[key]);
					}
					$scope.$broadcast("refreshCarleonServices");
					
				}, function (error) {
					toaster.pop({type: "error", title: $translate.instant("refresh"), body: $translate.instant("refresh_carleon_error")});
				})["finally"](function () {
					// All done, refreshing dashboard now
					toaster.clear(self.loaderToast);
					$scope.$broadcast("refreshDashboard");
				});
			});
		});
	}
    
    function getApiData() {
		return self.initAngharadSubmodules().then(function (result) {
			var promises = [ self.initAngharad() ];
			sagremorParams.benoicEnabled = false;
			sagremorParams.carleonEnabled = false;
			sagremorParams.garethEnabled = false;
			for (key in result) {
				sharedData.add("submodules", result[key].name, result[key]);
				if (result[key].name === "benoic" && result[key].enabled) {
					sagremorParams.benoicEnabled = true;
					promises.push(self.initBenoic());
				} else if (result[key].name === "carleon" && result[key].enabled) {
					sagremorParams.carleonEnabled = true;
					promises.push(self.initCarleon());
				} else if (result[key].name === "gareth" && result[key].enabled) {
					sagremorParams.garethEnabled = true;
					promises.push(self.initGareth());
				}
			}
			$q.all(promises).then(function () {
				$scope.$broadcast("submodulesChanged");
			}, function () {
				toaster.pop({type: "error", title: $translate.instant("angharad_loading_title"), body: $translate.instant("init_message_loading_error")});
			})["finally"](function () {
                self.initComplete = true;
                $scope.$broadcast("initComplete");
			});
		}, function (error) {
			toaster.pop({type: "error", title: $translate.instant("angharad_loading_title"), body: $translate.instant("init_message_loading_error")});
		});
	}
	
	function startRefreshTimeout() {
		// Refresh every 5 minutes if the window has the focus
		// If the window has not the focus, set a flag to refresh the page when it will have the focus
		return $interval(function () {
			if (self.hasFocus) {
				refreshData();
				self.shouldRefresh = false;
			} else {
				self.shouldRefresh = true;
			}
		}, 1000 * 60 * 5);
	}
	
	$window.onblur = function() {  
		self.hasFocus = false;  
	};
    
	$window.onfocus = function() {  
		self.hasFocus = true;  
		if (self.shouldRefresh) {
			refreshData();
			self.shouldRefresh = false;
		}
	};
    
    this.getAuth = function() {
		return angharadFactory.getAuth()
		.then(function(response) {
			sagremorParams.loggedIn = true;
			if ($location.url() === "/login") {
				$location.path("/");
			}
		},
		function(error) {
			if (error.status === 401) {
				sagremorParams.loggedIn = false;
				$location.path("/login");
			}
			return $q.reject(error);
		});
    };
    
    this.initAngharadSubmodules = function () {
        return angharadFactory.getSumboduleList();
    };
    
    this.initBenoic = function () {
        var promiseList = {
            deviceTypesResult: benoicFactory.getDeviceTypes(),
            deviceResult: benoicFactory.getDeviceList()
        };
        
        return $q.all(promiseList).then(function (result) {
            var deviceTypesResult = result.deviceTypesResult;
            var deviceResult = result.deviceResult;
            
            // Handle device types
            _.forEach(deviceTypesResult, function (type) {
                sharedData.add("benoicDeviceTypes", type.name, type);
            });
            $scope.$broadcast("benoicDeviceTypesChanged");
            
            // Handle devices
            var deviceList = [];
            var deviceListName = [];
            sharedData.removeAll("benoicDevices");
            for (index in deviceResult) {
                if (deviceResult[index].connected && deviceResult[index].enabled) {
                    deviceList.push(benoicFactory.getDeviceOverview(deviceResult[index].name));
                    deviceListName.push(deviceResult[index].name);
                }
                sharedData.add("benoicDevices", deviceResult[index].name, deviceResult[index]);
            }
            $q.all(deviceList).then(function (responses) {
                for (index in responses) {
                    var curDevice = sharedData.get("benoicDevices", deviceListName[index]);
                    curDevice.element = responses[index];
                }
                $scope.$broadcast("benoicDevicesChanged");
            }, function (error) {
                toaster.pop("error", $translate.instant("benoic_loading_title"), $translate.instant("benoic_loading_error"));
            });
        }, function (error) {
            toaster.pop("error", $translate.instant("benoic_loading_title"), $translate.instant("benoic_loading_error"));
        });
    }
    
	this.initCarleon = function () {
		sharedData.removeAll("carleonServices");
		
		return carleonFactory.getServiceList().then(function (result) {
			for (key in result) {
				_.forEach(result[key].element, function (element) {
					element.type = result[key].name;
				});
				sharedData.add("carleonServices", result[key].name, result[key]);
			}
			$scope.$broadcast("carleonServicesChanged");
		}, function (error) {
			toaster.pop({type: "error", title: $translate.instant("carleon_loading_title"), body: $translate.instant("carleon_loading_error")});
		});
		
	};
	
	this.initGareth = function () {
		sharedData.removeAll("garethFilters");
		sharedData.removeAll("garethAlertsSmtp");
		sharedData.removeAll("garethAlertsHttp");
		var qList = {
			filters: garethFactory.getFilterList(),
			alerts: garethFactory.getAlertList()
		}
		
		return $q.all(qList).then(function (results) {
			for (key in results.filters) {
				sharedData.add("garethFilters", results.filters[key].name, results.filters[key]);
			}
			for (key in results.alerts.smtp) {
				sharedData.add("garethAlertsSmtp", results.alerts.smtp[key].name, results.alerts.smtp[key]);
			}
			for (key in results.alerts.http) {
				sharedData.add("garethAlertsHttp", results.alerts.http[key].name, results.alerts.http[key]);
			}
			$scope.$broadcast("garethChange");
		}, function (error) {
			toaster.pop({type: "error", title: $translate.instant("gareth_loading_title"), body: $translate.instant("gareth_loading_error")});
		});
	};
	
	this.setDefaultProfile = function () {
		sagremorParams.currentProfile = false;
		_.forEach(sagremorParams.profiles, function (profile) {
			if (profile.default) {
				sagremorParams.currentProfile = profile;
				var exp = new $window.Date();
				exp = new $window.Date(exp.getFullYear() + 10, exp.getMonth(), exp.getDate());
				$cookies.put("ANGHARAD_PROFILE", profile.name, {expires: exp});
			}
		});
		
		if (!sagremorParams.currentProfile) {
			// No profile, add default one
			var defaultProfile = {name: $translate.instant("profile_default"), default: true, data: {} };
			sagremorParams.profiles = [
				defaultProfile
			];
			sagremorParams.currentProfile = defaultProfile;
			angharadFactory.setProfile($translate.instant("profile_default"), defaultProfile).then(function () {
				toaster.pop("success", $translate.instant("profile_save"), $translate.instant("profile_save_success"));
			}, function (error) {
				toaster.pop("error", $translate.instant("profile_save"), $translate.instant("profile_save_error"));
			});
			var exp = new $window.Date();
			exp = new $window.Date(exp.getFullYear() + 10, exp.getMonth(), exp.getDate());
			$cookies.put("ANGHARAD_PROFILE", $translate.instant("profile_default"), {expires: exp});
			$scope.$broadcast("angharadProfileChanged");
		}
	};
    
    this.initAngharad = function () {
		var promiseList = {
			scripts: angharadFactory.getScriptList(),
			schedulers: angharadFactory.getSchedulerList(),
			triggers: angharadFactory.getTriggerList(),
			profiles: angharadFactory.getProfileList()
		};
		
		return $q.all(promiseList).then(function (result) {
			for (sc in result.scripts) {
				sharedData.add("angharadScripts", result.scripts[sc].name, result.scripts[sc]);
			}
			$scope.$broadcast("angharadScriptsChanged");
			for (sh in result.schedulers) {
				sharedData.add("angharadSchedulers", result.schedulers[sh].name, result.schedulers[sh]);
			}
			$scope.$broadcast("angharadSchedulersChanged");
			for (tr in result.triggers) {
				sharedData.add("angharadTriggers", result.triggers[tr].name, result.triggers[tr]);
			}
			$scope.$broadcast("angharadTriggersChanged");
			
			if (result.profiles.length === 0) {
				self.setDefaultProfile();
				$scope.$broadcast("angharadProfileChanged");
			} else {
				sagremorParams.profiles = result.profiles;
				var profile_name = $cookies.get("ANGHARAD_PROFILE");
				sagremorParams.currentProfile = false;
				
				if (!!profile_name) {
					_.forEach(result.profiles, function (profile) {
						if (profile.name === profile_name) {
							sagremorParams.currentProfile = profile;
							$scope.$broadcast("angharadProfileChanged");
						}
					});
					if (!sagremorParams.currentProfile) {
						self.setDefaultProfile();
					}
				} else {
					self.setDefaultProfile();
				}
			}
        }, function (error) {
            toaster.pop("error", $translate.instant("angharad_loading_title"), $translate.instant("angharad_loading_error"));
        });
	};
	
    $scope.$on("reinitBenoic", function () {
        self.initBenoic();
    });
    
    $scope.$on("reinitCarleon", function () {
        self.initCarleon();
    });
    
    $scope.$on("reinitGareth", function () {
        self.initGareth();
    });
    
    $scope.$on("closeBenoic", function () {
        sharedData.removeAll("benoicDevices");
    });
    
    $scope.$on("closeCarleon", function () {
        sharedData.removeAll("carleonServices");
		sagremorParams.profiles = [];
		sagremorParams.currentProfile = false;
    });
    
    $scope.$on("closeGareth", function () {
		sharedData.removeAll("garethFilters");
		sharedData.removeAll("garethAlertsSmtp");
		sharedData.removeAll("garethAlertsHttp");
    });
    
    $scope.$on("refresh", function () {
		refreshData();
	});
    
    $scope.$on("loginSuccess", function () {
        init();
    });
    
    $scope.$on("initComplete", function() {
        if (self.initComplete) {
            closeLoader(true);
        } else if (self.benoicInitError) {
            closeLoader(false);
        }
    });
    
    init();
  }
);
