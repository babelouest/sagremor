angular.module('sagremorApp')
    .controller('ParametersCtrl', [
    '$scope',
    '$q',
    'toaster',
    'benoicFactory',
    'sharedData',
    'sagremorParams',
    'sagremorConfirm',
    function($scope, $q, toaster, benoicFactory, sharedData, sagremorParams, sagremorConfirm) {
      
      var self = this;
      
      this.sagremorParams = sagremorParams;
      
      this.deviceList = {};
      this.deviceTypes = {};
      this.deviceAdded = false;
      
      this.newDeviceName = "";
      this.newDeviceDescription = "";
      this.newDeviceType = "";
      this.newDeviceConnect = true;
      
      this.deviceOptionList = [];
      this.deviceOptionListDisplay = false;
      
      this.init = function() {
          self.deviceList = sharedData.all('benoicDevices');
          self.deviceTypes = sharedData.all('benoicDeviceTypes');
      };
      
      $scope.$on('benoicDevicesChanged', function () {
          self.deviceList = sharedData.all('benoicDevices');
      });
      
      $scope.$on('benoicDeviceTypesChanged', function () {
          self.deviceTypes = sharedData.all('benoicDeviceTypes');
      });
      
      this.addDevice = function () {
          self.deviceAdded = true;
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
                benoicFactory.connectDevice(deviceName).then(function() {
                    benoicFactory.getDevice(deviceName).then(function(response) {
                        benoicDevices.add(response);
                    });
                });
              } else {
                benoicFactory.getDevice(deviceName).then(function(response) {
                    benoicDevices.add(response);
                });
              }
              toaster.pop("success", "Add device", "Device added successfully");
          }, function (error) {
              toaster.pop("error", "Add device", "Error adding device");
          })['finally'](function () {
              self.deviceAdded = false;
              self.deviceList = benoicDevices.all();
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
              benoicFactory.connectDevice(device.name).then(function (response) {
                  toaster.pop("success", "Connect device", "Device connected successfully");
              }, function (error) {
                  toaster.pop("error", "Connect device", "Error connecting device");
                  device.connected = false;
              });
          } else {
              benoicFactory.disconnectDevice(device.name).then(function (response) {
                  toaster.pop("success", "Disconnect device", "Device disconnected successfully");
              }, function (error) {
                  toaster.pop("error", "Disconnect device", "Error disconnecting device");
                  device.connected = true;
              });
          }
      };
      
      this.enableDevice = function (device) {
          benoicFactory.setDevice(device).then(function () {
              if (device.enabled) {
                toaster.pop("success", "Enable device", "Device enabled successfully");
            } else {
                toaster.pop("success", "Disable device", "Device disabled successfully");
            }
          }, function (error) {
              if (device.enabled) {
                toaster.pop("error", "Enable device", "Error enabling device");
            } else {
                toaster.pop("error", "Disable device", "Error disabling device");
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
              toaster.pop("success", "Save device", "Device saved successfully");
          }, function (error) {
              toaster.pop("error", "Save device", "Error saving device");
          })['finally'](function () {
              device.update = false;
          });
      };
      
      this.cancelEditDevice = function (device) {
          device.newDescription = device.description;
          device.update = false;
      };
      
      this.removeDevice = function (device) {
          sagremorConfirm.open("Remove device", "Are you sure you want to remove this device ?").then (function(result) {
              benoicFactory.removeDevice(device.name).then(function (response) {
                  benoicDevices.remove(device.name);
                  self.deviceList = benoicDevices.all()
              });
          });
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
