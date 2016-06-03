function sagDimmerController (benoicFactory, sagremorParams, $translate, $uibModal) {
    var ctrl = this;
    
    ctrl.dimmer.valueChecked = (ctrl.dimmer.value === 1);
    ctrl.adminMode = sagremorParams.adminMode;
    ctrl.dimmer.newDisplay = ctrl.dimmer.display;
    ctrl.messages = {};
    
    function init() {
        ctrl.dimmer.type = "dimmer";
        $translate(["dimmer_edit", "dimmer_monitor"]).then(function (results) {
            ctrl.messages = results;
            ctrl.menu = [
                [ctrl.messages.dimmer_edit, function ($itemScope) {
                    ctrl.editDimmer();
                }],
                null,
                [ctrl.messages.dimmer_monitor, function ($itemScope) {
                    ctrl.monitorDimmer();
                }]
            ];
        });
    }
    
    ctrl.setDimmer = function (value) {
        benoicFactory.setElement(ctrl.dimmer.device, 'dimmer', ctrl.dimmer.name, value).then(function () {
            ctrl.dimmer.value = value;
        });
    };
    
    ctrl.editDimmer = function () {
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'components/dimmer/dimmer.modal.html',
            controller: 'DimmersModalCtrl',
            controllerAs: 'DimmersModalCtrl',
            size: 'sm',
            resolve: {
                dimmer: function () {
                    return ctrl.dimmer;
                }
            }
        });
    };
    
    ctrl.monitorDimmer = function () {
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'components/monitor/monitor.modal.html',
            controller: 'MonitorModalCtrl',
            controllerAs: 'MonitorModalCtrl',
            size: 'sm',
            resolve: {
                element: function () {
                    return ctrl.dimmer;
                }
            }
        });
    };
    
    init();
}

angular.module('sagremorApp').component('sagDimmer', {
    templateUrl: 'components/dimmer/dimmer.template.html',
    controller: sagDimmerController,
    bindings: {
        dimmer: '='
    }
});
