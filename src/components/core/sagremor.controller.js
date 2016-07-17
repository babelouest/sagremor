angular.module("sagremorApp")
  .controller("sagremorCtrl", 
  function($scope, $rootScope, $interval, $window, $http, $q, $location, $cookieStore, $translate, toaster, angharadFactory, benoicFactory, carleonFactory, garethFactory, sharedData, sagremorParams) {
    var self = this;
    
    this.loaderToast;
    this.initComplete = false;
    this.benoicInitError = false;
    this.shoudRefresh = false;
    this.hasFocus = true;
    this.refreshTimeout = null;
    
    function init() {
		initParameters();
        self.getAuth().then(function() {
			$rootScope.$broadcast("authChanged");
            popLoader();
            getApiData();
            self.refreshTimeout = startRefreshTimeout();
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
				getApiData();
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
			getApiData();
			self.shouldRefresh = false;
		}
	};
    
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
        $http.defaults.headers.common["ANGHARAD_SESSION_ID"] = $cookieStore.get("ANGHARAD_SESSION_ID");
        sagremorParams.adminMode = false;
        sagremorParams.loggedIn = true;
    }
    
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
		var qList = {
			services: carleonFactory.getServiceList(),
			profiles: carleonFactory.getProfileList()
		}
		
		sharedData.removeAll("carleonServices");
		
		return $q.all(qList).then(function (results) {
			for (key in results.services) {
				_.forEach(results.services[key].element, function (element) {
					element.type = results.services[key].name;
				});
				sharedData.add("carleonServices", results.services[key].name, results.services[key]);
			}
			$scope.$broadcast("carleonServicesChanged");
			
			if (results.profiles.length === 0) {
				self.setDefaultProfile();
			} else {
				sagremorParams.profiles = results.profiles;
				var profile_name = $cookieStore.get("ANGHARAD_PROFILE");
				sagremorParams.currentProfile = false;
				
				if (!!profile_name) {
					_.forEach(results.profiles, function (profile) {
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
			$scope.$broadcast("carleonProfilesChanged");
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
				$cookieStore.put("ANGHARAD_PROFILE", profile.name);
			}
		});
		
		if (!sagremorParams.currentProfile) {
			// No profile, add default one
			var defaultProfile = {name: $translate.instant("profile_default"), default: true, data: {} };
			sagremorParams.profiles = [
				defaultProfile
			];
			sagremorParams.currentProfile = defaultProfile;
			carleonFactory.setProfile($translate.instant("profile_default"), defaultProfile).then(function () {
				toaster.pop("success", $translate.instant("profile_save"), $translate.instant("profile_save_success"));
			}, function (error) {
				toaster.pop("error", $translate.instant("profile_save"), $translate.instant("profile_save_error"));
			});
			$cookieStore.put("ANGHARAD_PROFILE", $translate.instant("profile_default"));
			$scope.$broadcast("angharadProfileChanged");
		}
	};
    
    this.initAngharad = function () {
		var promiseList = {
			scripts: angharadFactory.getScriptList(),
			schedulers: angharadFactory.getSchedulerList(),
			triggers: angharadFactory.getTriggerList()
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
		popLoader();
		getApiData().then(function () {
		}, function (error) {
			toaster.pop({type: "error", title: $translate.instant("angharad_loading_title"), body: $translate.instant("init_message_loading_error")});
		})["finally"](function () {
			closeLoader(true);
		});
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
