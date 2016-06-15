angular.module('sagremorApp')
  .controller('sagremorCtrl', [
  '$scope',
  '$http',
  '$q',
  '$location',
  '$cookieStore',
  '$translate',
  'toaster',
  'angharadFactory',
  'benoicFactory',
  'carleonFactory',
  'sharedData',
  'sagremorParams',
  function($scope, $http, $q, $location, $cookieStore, $translate, toaster, angharadFactory, benoicFactory, carleonFactory, sharedData, sagremorParams) {
    var self = this;
    
    this.loaderToast;
    this.benoicInitComplete = false;
    this.benoicInitError = false;
    
    function init() {
		initParameters();
        self.getAuth().then(function() {
            popLoader();
            self.initAngharadSubmodules().then(function (result) {
				self.initAngharad();
                for (key in result) {
                    sharedData.add("submodules", result[key].name, result[key]);
                    if (result[key].name === "benoic" && result[key].enabled) {
                        self.initBenoic();
                    } else if (result[key].name === "carleon" && result[key].enabled) {
						self.initCarleon();
                    } else if (result[key].name === "gareth" && result[key].enabled) {
                    }
                }
                $scope.$broadcast("submodulesChanged");
            }, function (error) {
				toaster.pop({type: 'error', title: $translate.instant('angharad_loading_title'), body: $translate.instant('init_message_loading_error')});
            });
		});
    }
    
    $scope.$on("loginSuccess", function () {
        init();
    });
    
    $scope.$on("initComplete", function() {
        if (self.benoicInitComplete) {
            closeLoader(true);
        } else if (self.benoicInitError) {
            closeLoader(false);
        }
    });
    
    function closeLoader(result) {
        toaster.clear(self.loaderToast);
        if (result) {
            toaster.pop({type: 'success', title: $translate.instant('angharad_loading_title'), body: $translate.instant('init_message_loading_complete')});
        } else {
            toaster.pop({type: 'error', title: $translate.instant('angharad_loading_title'), body: $translate.instant('init_message_loading_error')});
        }
    }
    
    function popLoader() {
        self.loaderToast = toaster.pop({type: 'wait', title: $translate.instant('angharad_loading_title'), body: $translate.instant('init_message_loading'), timeout: 0, showCloseButton: false});
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
            console.log(error);
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
    
    $scope.$on("reinitBenoic", function () {
        self.initBenoic();
    });
    
    this.initBenoic = function () {
        var promiseList = {
            deviceTypesResult: benoicFactory.getDeviceTypes(),
            deviceResult: benoicFactory.getDeviceList()
        };
        
        $q.all(promiseList).then(function (result) {
            var deviceTypesResult = result.deviceTypesResult;
            var deviceResult = result.deviceResult;
            
            // Handle device types
            _.forEach(deviceTypesResult, function (type) {
                sharedData.add('benoicDeviceTypes', type.name, type);
            });
            $scope.$broadcast('benoicDeviceTypesChanged');
            
            // Handle devices
            var deviceList = [];
            var deviceListName = [];
            for (index in deviceResult) {
                if (deviceResult[index].connected && deviceResult[index].enabled) {
                    deviceList.push(benoicFactory.getDeviceOverview(deviceResult[index].name));
                    deviceListName.push(deviceResult[index].name);
                }
                sharedData.add('benoicDevices', deviceResult[index].name, deviceResult[index]);
            }
            $q.all(deviceList).then(function (responses) {
                for (index in responses) {
                    var curDevice = sharedData.get('benoicDevices', deviceListName[index]);
                    curDevice.element = responses[index];
                }
                $scope.$broadcast('benoicDevicesChanged');
            }, function (error) {
                toaster.pop("error", $translate.instant('benoic_loading_title'), $translate.instant('benoic_loading_error'));
            })['finally'](function () {
                self.benoicInitComplete = true;
                $scope.$broadcast("initComplete");
            });
        }, function (error) {
            toaster.pop("error", $translate.instant('benoic_loading_title'), $translate.instant('benoic_loading_error'));
        });
    }
    
	this.initCarleon = function () {
		var qList = {
			services: carleonFactory.getServiceList(),
			profiles: carleonFactory.getProfileList()
		}
		
		$q.all(qList).then(function (results) {
			for (key in results.services) {
				_.forEach(results.services[key].element, function (element) {
					element.type = results.services[key].name;
				});
				sharedData.add('carleonServices', results.services[key].name, results.services[key]);
			}
			$scope.$broadcast('carleonServicesChanged');
			
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
						}
					});
					if (!sagremorParams.currentProfile) {
						self.setDefaultProfile();
					}
				} else {
					self.setDefaultProfile();
				}
			}
			$scope.$broadcast('carleonProfilesChanged');
		}, function (error) {
			toaster.pop({type: 'error', title: $translate.instant('carleon_loading_title'), body: $translate.instant('carleon_loading_error')});
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
		}
	};
    
    this.initAngharad = function () {
		var promiseList = {
			scripts: angharadFactory.getScriptList(),
			schedulers: angharadFactory.getSchedulerList(),
			triggers: angharadFactory.getTriggerList()
		};
		
		$q.all(promiseList).then(function (result) {
			for (sc in result.scripts) {
				sharedData.add("angharadScripts", sc, result.script[sc]);
			}
			$scope.$broadcast('angharadScriptsChanged');
			for (sh in result.schedulers) {
				sharedData.add("angharadSchedulers", sh, result.schedulers[sh]);
			}
			$scope.$broadcast('angharadSchedulersChanged');
			for (tr in result.triggers) {
				sharedData.add("angharadTriggers", tr, result.triggers[tr]);
			}
			$scope.$broadcast('angharadTriggersChanged');
        }, function (error) {
            toaster.pop("error", $translate.instant('angharad_loading_title'), $translate.instant('angharad_loading_error'));
        });
	};
	
    init();
  }
]);
