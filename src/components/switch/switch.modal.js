angular.module('sagremorApp')
    .controller('SwitchesModalCtrl', [
    '$scope',
    '$uibModalInstance',
    '$translate',
    'toaster',
    'angharadConstant',
    'benoicFactory',
    'switcher',
    function($scope, $uibModalInstance, $translate, toaster, angharadConstant, benoicFactory, switcher) {
        var self = this;
        
        this.switcher = switcher;
        this.switcher.newDisplay = this.switcher.display;
        
        this.monitorEveryEnum = angharadConstant.monitoredEveryEnum;
        this.messages = {};
        
        function init() {
            console.log(self.switcher.monitored_every);
            $translate(["switch_save", "switch_save_success", "switch_save_error"]).then(function (results) {
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
        
        this.saveSwitcher = function () {
            console.log(self.switcher.monitored_every);
            return;
            self.switcher.display = self.switcher.newDisplay;
            self.switcher.monitor = self.switcher.monitorChecked?1:0;
            benoicFactory.updateElement(self.switcher.device, "switch", self.switcher.name, self.switcher).then(function (response) {
                $scope.$broadcast('benoicSwitchesChanged');
                toaster.pop("success", self.messages.switch_save, self.messages.switch_save_success);
            }, function (error) {
                toaster.pop("error", self.messages.switch_save, self.messages.switch_save_error);
            })['finally'](function () {
                $uibModalInstance.dismiss('close');
            });
        };
        
        init();
    }
]);
