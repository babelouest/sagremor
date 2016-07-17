angular.module("sagremorApp")
    .controller("ParametersCtrl",
    function($scope, $rootScope, $q, $location, $translate, $cookieStore, toaster, angharadFactory, benoicFactory, carleonFactory, sharedData, sagremorConfirm, sagremorParams) {
      
		var self = this;

		this.submodules;

		this.deviceList = {};
		this.deviceTypes = {};
		this.deviceAdded = false;

		this.newDeviceName = "";
		this.newDeviceDescription = "";
		this.newDeviceType = "";
		this.newDeviceConnect = true;

		this.deviceOptionList = [];
		this.deviceOptionListDisplay = false;

		this.profileList = [];
		this.currentProfile = false;
		this.profileAdded = false;
		
		this.sagremorParams = sagremorParams;

		this.init = function() {
			if (!sagremorParams.loggedIn) {
				$location.path("/login");
			}

			self.submodules = sharedData.all("submodules");
			self.deviceList = sharedData.all("benoicDevices");
			self.initDeviceTypes();
			self.selectedLang = $translate.use();
			self.profileList = sagremorParams.profiles;
			self.currentProfile = sagremorParams.currentProfile;
		};

		$scope.$on("submodulesChanged", function () {
			self.submodules = sharedData.all("submodules");
		});

		$scope.$on("benoicDevicesChanged", function () {
			self.deviceList = sharedData.all("benoicDevices");
		});

		$scope.$on("benoicDeviceTypesChanged", function () {
			self.initDeviceTypes();
		});

		this.addDevice = function () {
			self.deviceAdded = true;
		};

		this.isDeviceValid = function () {
			if (!self.newDeviceName || self.newDeviceName.length > 64) {
				return false;
			}

			for (var name in self.deviceList) {
				if (self.newDeviceName === name) {
					return false;
				}
			}

			if (!self.newDeviceDescription || self.newDeviceDescription > 128) {
				return false;
			}

			if (!self.newDeviceType) {
				return false;
			}

			for (var key in self.deviceOptionList) {
				var option = self.deviceOptionList[key];

				if (!option.optional && !option.value) {
					return false;
				}
			}

			return true;
		};

		this.postNewDevice = function () {

			var curOptions = {};
			_.forEach(self.deviceOptionList, function (option) {
				if (option.type === "boolean") {
					curOptions[option.name] = !!option.value;
				} else if (option.type === "numeric") {
					curOptions[option.name] = parseFloat(option.value);
				} else {
					curOptions[option.name] = option.value;
				}
			});
			var deviceName = self.newDeviceName;
			benoicFactory.addDevice({name: deviceName, display: self.newDeviceName, description: self.newDeviceDescription, enabled: true, type_uid: self.newDeviceType, options: curOptions}).then(function (response) {
				if (self.newDeviceConnect) {
					self.connectDevice({name: deviceName, connected: true}).then(function(result) {
						toaster.pop("success", $translate.instant("device_add"), $translate.instant("device_add_success"));
						$rootScope.$broadcast("reinitBenoic");
					});
				} else {
					toaster.pop("success", $translate.instant("device_add"), $translate.instant("device_add_success"));
					$rootScope.$broadcast("reinitBenoic");
				}
			}, function (error) {
				toaster.pop("error", $translate.instant("device_add"), $translate.instant("device_add_error"));
			})["finally"](function () {
				self.deviceAdded = false;
				self.deviceList = sharedData.all("benoicDevices");
				self.newDeviceName = "";
				self.newDeviceDescription = "";
				self.newDeviceType = "";
				self.newDeviceConnect = true;
				self.deviceOptionList = [];
			});
		};

		this.cancelNewDevice = function () {
			self.deviceAdded = false;
			self.newDeviceName = "";
			self.newDeviceDescription = "";
			self.newDeviceType = "";
			self.deviceOptionList = [];
		};

		this.setDeviceOptions = function () {
			if (!!self.newDeviceType) {
				self.deviceOptionList = _.find(self.deviceTypes, function(type) { return type.uid === self.newDeviceType; }).options;
				self.deviceOptionListDisplay = true;
			} else {
				self.deviceOptionListDisplay = false;
			}
		};

		this.connectDevice = function (device) {
			if (device.connected) {
				return benoicFactory.connectDevice(device.name).then(function (response) {
					toaster.pop("success", $translate.instant("device_connect"), $translate.instant("device_connect_success"));
				}, function (error) {
					toaster.pop("error", $translate.instant("device_connect"), $translate.instant("device_connect_error"));
					device.connected = false;
				});
			} else {
				return benoicFactory.disconnectDevice(device.name).then(function (response) {
					toaster.pop("success", $translate.instant("device_disconnect"), $translate.instant("device_disconnect_success"));
				}, function (error) {
					toaster.pop("error", $translate.instant("device_disconnect"), $translate.instant("device_disconnect_error"));
					device.connected = true;
				});
			}
		};

		this.enableDevice = function (device) {
			var copyDevice = angular.copy(device);
			delete copyDevice.element;
			benoicFactory.setDevice(copyDevice).then(function () {
				if (copyDevice.enabled) {
					toaster.pop("success", $translate.instant("device_disable"), $translate.instant("device_enable_success"));
				} else {
					toaster.pop("success", $translate.instant("device_disable"), $translate.instant("device_disable_success"));
				}
			}, function (error) {
				if (copyDevice.enabled) {
					toaster.pop("error", $translate.instant("device_disable"), $translate.instant("device_enable_error"));
				} else {
					toaster.pop("error", $translate.instant("device_disable"), $translate.instant("device_disable_error"));
				}
			});
		};

		this.editDevice = function (device) {
		  device.newDescription = device.description;
		  device.update = true;
		};

		this.saveDevice = function (device) {
			device.description = device.newDescription;
			benoicFactory.setDevice(device).then(function (response) {
				toaster.pop("success", $translate.instant("device_save"), $translate.instant("device_save_success"));
			}, function (error) {
				toaster.pop("error", $translate.instant("device_save"), $translate.instant("device_save_error"));
			})["finally"](function () {
				device.update = false;
			});
		};

		this.cancelEditDevice = function (device) {
			device.newDescription = device.description;
			device.update = false;
		};

		this.removeDevice = function (device) {
			sagremorConfirm.open($translate.instant("device_remove"), $translate.instant("device_remove_confirm")).then (function(result) {
				benoicFactory.removeDevice(device.name).then(function (response) {
					sharedData.remove("benoicDevices", device.name);
					self.deviceList = sharedData.all("benoicDevices");
					toaster.pop("success", $translate.instant("device_remove"), $translate.instant("device_remove_success"));
				}, function (error) {
					toaster.pop("error", $translate.instant("device_remove"), $translate.instant("device_remove_error"));
				});
			});
		};

		this.initDeviceTypes = function () {
			self.deviceTypes = sharedData.all("benoicDeviceTypes");
			_.forEach(self.deviceTypes, function (type) {
				$translate(type.uid + "_device_type").then(function(translate) {
					type.translate = translate;
				}, function (error) {
					type.translate = type.name;
				});
			});
		};

		this.submoduleEnable = function(submodule) {
			if (submodule === "benoic") {
				angharadFactory.enableSubmodule(submodule, self.submodules.benoic.enabled).then(function (response) {
					sagremorParams.benoicEnabled = self.submodules.benoic.enabled;
					$rootScope.$broadcast("submodulesChanged");
					$rootScope.$broadcast("refreshDashboard")
					if (self.submodules.benoic.enabled) {
						$rootScope.$broadcast("reinitBenoic");
					} else {
						$rootScope.$broadcast("closeBenoic");
					}
					toaster.pop("success", $translate.instant("submodules"), $translate.instant("submodules_enable_success"));
				}, function (error) {
					toaster.pop("error", $translate.instant("submodules"), $translate.instant("submodules_enable_error"));
				});
			} else if (submodule === "carleon") {
				angharadFactory.enableSubmodule(submodule, self.submodules.carleon.enabled).then(function (response) {
					sagremorParams.carleonEnabled = self.submodules.carleon.enabled;
					$rootScope.$broadcast("submodulesChanged");
					$rootScope.$broadcast("refreshDashboard")
					if (self.submodules.carleon.enabled) {
						$rootScope.$broadcast("reinitCarleon");
					} else {
						$rootScope.$broadcast("closeCarleon");
					}
					toaster.pop("success", $translate.instant("submodules"), $translate.instant("submodules_enable_success"));
				}, function (error) {
					toaster.pop("error", $translate.instant("submodules"), $translate.instant("submodules_enable_error"));
				});
			} else if (submodule === "gareth") {
				angharadFactory.enableSubmodule(submodule, self.submodules.gareth.enabled).then(function (response) {
					sagremorParams.garethEnabled = self.submodules.gareth.enabled;
					$rootScope.$broadcast("submodulesChanged");
					$rootScope.$broadcast("refreshDashboard")
					if (self.submodules.gareth.enabled) {
						$rootScope.$broadcast("reinitGareth");
					} else {
						$rootScope.$broadcast("closeGareth");
					}
					toaster.pop("success", $translate.instant("submodules"), $translate.instant("submodules_enable_success"));
				}, function (error) {
					toaster.pop("error", $translate.instant("submodules"), $translate.instant("submodules_enable_error"));
				});
			}
		};

		this.addProfile = function () {
			self.newProfileName = "";
			self.newProfileDescription = "";
			self.newProfileDefault = false;
			self.profileAdded = true;
		};

		this.cancelNewProfile = function () {
			self.profileAdded = false;
		};
		
		this.isProfileValid = function () {
			var result = self.newProfileName.length > 0;
			_.forEach(self.profileList, function (profile) {
				if (profile.name === self.newProfileName) {
					result = false;
				}
			});
			return result;
		};
		
		this.saveNewProfile = function () {
			var newProfile = {name: self.newProfileName, description: self.newProfileDescription, default: self.newProfileDefault};
			carleonFactory.setProfile(self.newProfileName, newProfile).then(function () {
				toaster.pop("success", $translate.instant("profiles"), $translate.instant("profiles_add_success"));
				$scope.$broadcast("carleonProfilesChanged");
				self.profileList.push(newProfile);
			}, function (error) {
				toaster.pop("error", $translate.instant("profiles"), $translate.instant("profiles_add_error"));
			})["finally"](function () {
				self.profileAdded = false;
			});
		};

		this.removeProfile = function (profile) {
			sagremorConfirm.open($translate.instant("profile_remove"), $translate.instant("profile_remove_confirm")).then (function(result) {
				carleonFactory.removeProfile(profile.name).then(function () {
					toaster.pop("success", $translate.instant("profiles"), $translate.instant("profiles_remove_success"));
					$scope.$broadcast("carleonProfilesChanged");
					_.remove(self.profileList, function (curProfile) {
						return profile.name === curProfile.name;
					});
				}, function (error) {
					toaster.pop("error", $translate.instant("profiles"), $translate.instant("profiles_remove_error"));
				});
			});
		};

		this.editProfile = function (profile) {
			profile.update = true;
			profile.newName = profile.name;
			profile.newDescription = profile.description;
		};

		this.cancelEditProfile = function (profile) {
			profile.update = false;
			profile.name = profile.newName;
			profile.description = profile.newDescription;
		};

		this.isUpdateProfileValid = function (profile) {
			var result = profile.newName.length > 0;
			_.forEach(self.profileList, function (curProfile) {
				if (profile.name !== curProfile.name && profile.newName === curProfile.name) {
					// Duplicate name, avoid
					result = false;
				}
			});
			return result;
		};

		this.saveProfile = function (profile) {
			if (profile.name !== profile.savedName) {
				// Remve old profile, then add new one
				var savedName = profile.newName;
				profile.name = profile.newName;
				profile.description = profile.newDescription;
				delete profile.newName;
				delete profile.newDescription;
				delete profile.update;
				var promises = {
					remove: carleonFactory.removeProfile(savedName),
					add: carleonFactory.setProfile(profile.name, profile)
				}

				$q.all(promises).then(function (results) {
					$scope.$broadcast("carleonProfilesChanged");
					toaster.pop("success", $translate.instant("profiles"), $translate.instant("profiles_save_success"));
				}, function (error) {
					toaster.pop("error", $translate.instant("profiles"), $translate.instant("profiles_save_error"));
				});
			} else {
			  // Update profile
				delete profile.savedName;
				delete profile.savedDescription;
				delete profile.update;
				carleonFactory.setProfile(profile.name, profile).then(function (result) {
					$scope.$broadcast("carleonProfilesChanged");
					toaster.pop("success", $translate.instant("profiles"), $translate.instant("profiles_save_success"));
				}, function (error) {
					toaster.pop("error", $translate.instant("profiles"), $translate.instant("profiles_save_error"));
				});
			}
		};
		
		this.setDefaultProfile = function (profile) {
			if (!profile.default) {
				// Update just this one
				delete profile.savedName;
				delete profile.savedDescription;
				delete profile.update;
				carleonFactory.setProfile(profile.name, profile).then(function (result) {
					$scope.$broadcast("carleonProfilesChanged");
					toaster.pop("success", $translate.instant("profiles"), $translate.instant("profiles_save_success"));
				}, function (error) {
					toaster.pop("error", $translate.instant("profiles"), $translate.instant("profiles_save_error"));
				});
			} else {
				// Set this one to default, and set the other default to false
				delete profile.update;
				carleonFactory.setProfile(profile.name, profile).then(function (result) {
					_.forEach(self.profileList, function (curProfile) {
						if (curProfile.default && curProfile.name !== profile.name) {
							curProfile.default = false;
							carleonFactory.setProfile(curProfile.name, curProfile).then(function (result) {
							}, function (error) {
								toaster.pop("error", $translate.instant("profiles"), $translate.instant("profiles_save_error"));
							});
						}
					});
					$scope.$broadcast("carleonProfilesChanged");
					toaster.pop("success", $translate.instant("profiles"), $translate.instant("profiles_save_success"));
				}, function (error) {
				  toaster.pop("error", $translate.instant("profiles"), $translate.instant("profiles_save_error"));
				});
			}
		};
		
		this.useProfile = function (profile) {
			sagremorParams.currentProfile = profile;
			$cookieStore.put("ANGHARAD_PROFILE", profile.name);
			$rootScope.$broadcast("carleonProfileUpdated");
		};
		
		$scope.$on("carleonProfilesChanged", function () {
			self.profileList = sagremorParams.profiles;
		});

		$scope.$on("carleonProfileUpdated", function () {
			self.currentProfile = sagremorParams.currentProfile;
		});

		this.init();
    }
).filter("deviceTypeName", [
    "sharedData",
    function(sharedData) {
        return function(input) {
          var types = sharedData.all("benoicDeviceTypes");
          for (key in types) {
            if (types[key].uid === input) {
              return types[key].name;
            }
          }
          return false;
        };
    }]);
