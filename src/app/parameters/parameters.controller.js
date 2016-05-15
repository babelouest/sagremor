angular.module('sagremorApp')
  .controller('ParametersCtrl', [
  '$scope',
  '$q',
  'benoicFactory',
  'sharedData',
  function($scope, $q, benoicFactory, sharedData) {
      
      var self = this;
      
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
              }, function (error) {
                  device.connected = false;
              });
          } else {
              benoicFactory.disconnectDevice(device.name).then(function (response) {
              }, function (error) {
                  device.connected = true;
              });
          }
      };
      
      this.enableDevice = function (device) {
          benoicFactory.setDevice(device).then(function () {
          });
      };
      
      this.editDevice = function (device) {
          device.newDescription = device.description;
          device.update = true;
      };
      
      this.saveDevice = function (device) {
          device.description = device.newDescription;
          benoicFactory.setDevice(device).then(function (response) {
          })['finally'](function () {
              device.update = false;
          });
      };
      
      this.cancelEditDevice = function (device) {
          device.newDescription = device.description;
          device.update = false;
      };
      
      this.removeDevice = function (device) {
          benoicFactory.removeDevice(device.name).then(function (response) {
              benoicDevices.remove(device.name);
              self.deviceList = benoicDevices.all()
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
