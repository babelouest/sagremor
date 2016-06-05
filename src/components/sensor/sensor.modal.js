angular.module('sagremorApp')
    .controller('SensorsModalCtrl', [
    '$scope',
    '$uibModalInstance',
    '$translate',
    'toaster',
    'angharadConstant',
    'benoicFactory',
    'sensor',
    function($scope, $uibModalInstance, $translate, toaster, angharadConstant, benoicFactory, sensor) {
        var self = this;
        
        this.sensor = sensor;
        this.sensor.newDisplay = this.sensor.display;
        
        this.monitorEveryEnum = angharadConstant.monitoredEveryEnum;
        this.messages = {};
        
        function init() {
			self.sensor.menu = false;
            $translate(["sensor_save", "sensor_save_success", "sensor_save_error"]).then(function (results) {
                self.messages = results;
            });
            
            _.forEach(self.monitorEveryEnum, function(monitorEvery) {
                $translate(monitorEvery.label).then(function (trLabel) {
                    monitorEvery.trLabel = trLabel;
                });
            });
        }
        
        this.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
        
        this.saveSensor = function () {
            self.sensor.display = self.sensor.newDisplay;
            self.sensor.monitor = self.sensor.monitorChecked?1:0;
            benoicFactory.updateElement(self.sensor.device, "sensor", self.sensor.name, self.sensor).then(function (response) {
                $scope.$broadcast('benoicSensoresChanged');
                toaster.pop("success", self.messages.sensor_save, self.messages.sensor_save_success);
            }, function (error) {
                toaster.pop("error", self.messages.sensor_save, self.messages.sensor_save_error);
            })['finally'](function () {
                $uibModalInstance.dismiss('close');
            });
        };
        
        init();
    }
]);
