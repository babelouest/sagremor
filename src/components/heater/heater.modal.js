angular.module('sagremorApp')
    .controller('HeatersModalCtrl', [
    '$scope',
    '$uibModalInstance',
    '$translate',
    'toaster',
    'angharadConstant',
    'benoicFactory',
    'heater',
    function($scope, $uibModalInstance, $translate, toaster, angharadConstant, benoicFactory, heater) {
        var self = this;
        
        this.heater = heater;
        this.heater.newDisplay = this.heater.display;
        
        this.monitorEveryEnum = angharadConstant.monitoredEveryEnum;
        this.messages = {};
        
        function init() {
			self.heater.menu = false;
            $translate(["heater_save", "heater_save_success", "heater_save_error"]).then(function (results) {
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
        
        this.saveHeater = function () {
            self.heater.display = self.heater.newDisplay;
            self.heater.monitor = self.heater.monitorChecked?1:0;
            benoicFactory.updateElement(self.heater.device, "heater", self.heater.name, self.heater).then(function (response) {
                $scope.$broadcast('benoicHeatersChanged');
                toaster.pop("success", self.messages.heater_save, self.messages.heater_save_success);
            }, function (error) {
                toaster.pop("error", self.messages.heater_save, self.messages.heater_save_error);
            })['finally'](function () {
                $uibModalInstance.dismiss('close');
            });
        };
        
        init();
    }
]);
