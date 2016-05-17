angular.module('sagremorApp')
    .controller('SwitchesModalCtrl', [
    '$uibModalInstance',
    'toaster',
    'angharadConstant',
    'benoicFactory',
    'switcher',
    function($uibModalInstance, toaster, angharadConstant, benoicFactory, switcher) {
        var self = this;
        
        this.switcher = switcher;
        this.switcher.newDisplay = this.switcher.display;
        
        this.monitorEveryEnum = angharadConstant.monitoredEveryEnum;
        
        this.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
        
        this.saveSwitcher = function () {
            this.switcher.display = this.switcher.newDisplay;
            this.switcher.monitor = this.switcher.monitorChecked?1:0;
            benoicFactory.updateElement(self.switcher.device, self.switcher.name, "switch", self.switcher).then(function (response) {
                $scope.$broadcast('benoicSwitchesChanged');
                toaster.pop("success", "Save switch", "Switch saved successfully");
            }, function (error) {
                toaster.pop("error", "Save switch", "Error saving switch");
            })['finally'](function () {
                $uibModalInstance.dismiss('close');
            });
        };
        
        this.getMonitorEveryLabel = function (monitorEvery) {
            // TODO: Implement l18n
            return monitorEvery;
        };
    }
]);
