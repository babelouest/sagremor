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
        
        function init() {
			self.heater.menu = false;
            
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
                toaster.pop("success", $translate.instant('heater_save'), $translate.instant('heater_save_success'));
            }, function (error) {
                toaster.pop("error", $translate.instant('heater_save'), $translate.instant('heater_save_error'));
            })['finally'](function () {
                $uibModalInstance.dismiss('close');
            });
        };
        
        init();
    }
]);
