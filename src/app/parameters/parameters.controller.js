angular.module('sagremorApp')
    .controller('ParametersCtrl', [
    '$scope',
    '$rootScope',
    '$q',
    '$translate',
    'toaster',
    'angharadFactory',
    'benoicFactory',
    'sharedData',
    'sagremorParams',
    'sagremorConfirm',
    function($scope, $rootScope, $q, $translate, toaster, angharadFactory, benoicFactory, sharedData, sagremorParams, sagremorConfirm) {
      
      var self = this;
      
      this.sagremorParams = sagremorParams;
      
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
      
      this.messages = {};
      this.langList = [
        {name: "fr", display: "Français"},
        {name: "en", display: "English"}
      ];
      
      this.init = function() {
          $translate(["device_add", "device_add_success", "device_add_error",
                      "device_connect", "device_connect_success", "device_connect_error",
                      "device_disconnect", "device_disconnect_success", "device_disconnect_error",
                      "device_enable", "device_enable_success", "device_enable_error",
                      "device_disable", "device_disable_success", "device_disable_error",
                      "device_save", "device_save_success", "device_save_error",
                      "device_remove", "device_remove_confirm", "device_remove_success", "device_remove_error",
                      "submodules", "submodules_enable_success", "submodules_enable_error"
                      ]).then(function (results) {
            self.messages = results;
          });
          self.submodules = sharedData.all("submodules");
          self.deviceList = sharedData.all('benoicDevices');
          self.initDeviceTypes();
          self.selectedLang = $translate.use();
      };
      
      $scope.$on('submodulesChanged', function () {
          self.submodules = sharedData.all("submodules");
      });
      
      $scope.$on('benoicDevicesChanged', function () {
          self.deviceList = sharedData.all('benoicDevices');
      });
      
      $scope.$on('benoicDeviceTypesChanged', function () {
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
                      toaster.pop("success", self.messages.device_add, self.messages.device_add_success);
                      $rootScope.$broadcast("reinitBenoic");
                  });
              } else {
                  toaster.pop("success", self.messages.device_add, self.messages.device_add_success);
                  $rootScope.$broadcast("reinitBenoic");
              }
          }, function (error) {
              toaster.pop("error", self.messages.device_add, self.messages.device_add_error);
          })['finally'](function () {
              self.deviceAdded = false;
              self.deviceList = sharedData.all('benoicDevices');
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
                  toaster.pop("success", self.messages.device_connect, self.messages.device_connect_success);
              }, function (error) {
                  toaster.pop("error", self.messages.device_connect, self.messages.device_connect_error);
                  device.connected = false;
              });
          } else {
              return benoicFactory.disconnectDevice(device.name).then(function (response) {
                  toaster.pop("success", self.messages.device_disconnect, self.messages.device_disconnect_success);
              }, function (error) {
                  toaster.pop("error", self.messages.device_disconnect, self.messages.device_disconnect_error);
                  device.connected = true;
              });
          }
      };
      
      this.enableDevice = function (device) {
          var copyDevice = angular.copy(device);
          delete copyDevice.element;
          benoicFactory.setDevice(copyDevice).then(function () {
              if (copyDevice.enabled) {
                  toaster.pop("success", self.messages.device_enable, self.messages.device_enable_success);
              } else {
                  toaster.pop("success", self.messages.device_disable, self.messages.device_disable_success);
              }
          }, function (error) {
              if (copyDevice.enabled) {
                  toaster.pop("error", self.messages.device_disable, self.messages.device_enable_error);
              } else {
                  toaster.pop("error", self.messages.device_disable, self.messages.device_disable_error);
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
              toaster.pop("success", self.messages.device_save, self.messages.device_save_success);
          }, function (error) {
              toaster.pop("error", self.messages.device_save, self.messages.device_save_error);
          })['finally'](function () {
              device.update = false;
          });
      };
      
      this.cancelEditDevice = function (device) {
          device.newDescription = device.description;
          device.update = false;
      };
      
      this.removeDevice = function (device) {
          sagremorConfirm.open(self.messages.device_remove, self.messages.device_remove_confirm).then (function(result) {
              benoicFactory.removeDevice(device.name).then(function (response) {
                  sharedData.remove('benoicDevices', device.name);
                  self.deviceList = sharedData.all('benoicDevices');
                  toaster.pop("success", self.messages.device_remove, self.messages.device_remove_success);
              }, function (error) {
                  toaster.pop("error", self.messages.device_remove, self.messages.device_remove_error);
              });
          });
      };
      
      this.initDeviceTypes = function () {
          self.deviceTypes = sharedData.all('benoicDeviceTypes');
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
                toaster.pop("success", self.messages.submodules, self.messages.submodules_enable_success);
            }, function (error) {
                toaster.pop("error", self.messages.submodules, self.messages.submodules_enable_error);
            });
          } else if (submodule === "carleon") {
            angharadFactory.enableSubmodule(submodule, self.submodules.carleon.enabled).then(function (response) {
                toaster.pop("success", self.messages.submodules, self.messages.submodules_enable_success);
            }, function (error) {
                toaster.pop("error", self.messages.submodules, self.messages.submodules_enable_error);
            });
          } else if (submodule === "gareth") {
            angharadFactory.enableSubmodule(submodule, self.submodules.gareth.enabled).then(function (response) {
                toaster.pop("success", self.messages.submodules, self.messages.submodules_enable_success);
            }, function (error) {
                toaster.pop("error", self.messages.submodules, self.messages.submodules_enable_error);
            });
          }
      };
      
      this.changeLang = function () {
          $translate.use(self.selectedLang);
      };
      
      self.init();
    }
]).filter('deviceTypeName', [
    'sharedData',
    function(sharedData) {
        return function(input) {
          var types = sharedData.all('benoicDeviceTypes');
          for (key in types) {
            if (types[key].uid === input) {
              return types[key].name;
            }
          }
          return false;
        };
    }]);
