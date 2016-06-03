angular.module('sagremorApp')
    .controller('DimmersModalCtrl', [
    '$scope',
    '$uibModalInstance',
    '$translate',
    'toaster',
    'angharadConstant',
    'benoicFactory',
    'dimmer',
    function($scope, $uibModalInstance, $translate, toaster, angharadConstant, benoicFactory, dimmer) {
        var self = this;
        
        this.dimmer = dimmer;
        this.dimmer.newDisplay = this.dimmer.display;
        
        this.monitorEveryEnum = angharadConstant.monitoredEveryEnum;
        this.messages = {};
        
        function init() {
            $translate(["dimmer_save", "dimmer_save_success", "dimmer_save_error"]).then(function (results) {
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
        
        this.saveDimmer = function () {
            self.dimmer.display = self.dimmer.newDisplay;
            self.dimmer.monitor = self.dimmer.monitorChecked?1:0;
            benoicFactory.updateElement(self.dimmer.device, "dimmer", self.dimmer.name, self.dimmer).then(function (response) {
                $scope.$broadcast('benoicDimmersChanged');
                toaster.pop("success", self.messages.dimmer_save, self.messages.dimmer_save_success);
            }, function (error) {
                toaster.pop("error", self.messages.dimmer_save, self.messages.dimmer_save_error);
            })['finally'](function () {
                $uibModalInstance.dismiss('close');
            });
        };
        
        init();
    }
]);
