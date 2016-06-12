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
    this.messages = {};
    
    function init() {
        $translate(["init_message_loading", "init_message_loading_complete", "init_message_loading_error"]).then(function (results) {
          self.messages = results;
        });
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
            toaster.pop({type: 'success', title: "Angharad", body: self.messages.init_message_loading_complete});
        } else {
            toaster.pop({type: 'error', title: "Angharad", body: self.messages.init_message_loading_error});
        }
    }
    
    function popLoader() {
        self.loaderToast = toaster.pop({type: 'wait', title: "Angharad", body: self.messages.init_message_loading, timeout: 0, showCloseButton: false});
    }
    
    function initParameters() {
        $http.defaults.headers.common["ANGHARAD_SESSION_ID"] = $cookieStore.get("ANGHARAD_SESSION_ID");
        sagremorParams.adminMode = false;
    }
    
    this.getAuth = function() {
      return angharadFactory.getAuth()
        .then(function(response) {
          if ($location.url() === "/login") {
              $location.path("/");
          }
        },
        function(error) {
          if (error.status === 401) {
            $location.path("/login");
          }
          return $q.reject(error);
        });
    };
    
    this.logout = function() {
      angharadFactory.deleteAuth()
        .then(function(response) {
          $scope.isLogged = false;
          $location.path("/login");
          $http.defaults.headers.common["ANGHARAD_SESSION_ID"] = "";
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
                toaster.pop("error", "Overview devices", "Error loading devices overview");
            })['finally'](function () {
                self.benoicInitComplete = true;
                $scope.$broadcast("initComplete");
            });
        }, function (error) {
            toaster.pop("error", "Benoic", "Error loading benoic");
        });
    }
    
	this.initCarleon = function () {
		carleonFactory.getServiceList().then(function (result) {
			for (key in result) {
				_.forEach(result[key].element, function (element) {
					element.type = result[key].name;
				});
				sharedData.add('carleonServices', result[key].name, result[key]);
			}
			$scope.$broadcast('carleonServicesChanged');
		});
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
            toaster.pop("error", "Benoic", "Error loading angharad");
        });
	};
	
    init();
  }
]);
