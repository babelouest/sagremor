function sagSwitchController (benoicFactory, sagremorParams, $translate, $uibModal) {
    var ctrl = this;
    
    ctrl.switcher.valueChecked = (ctrl.switcher.value === 1);
    ctrl.adminMode = sagremorParams.adminMode;
    ctrl.switcher.newDisplay = ctrl.switcher.display;
    ctrl.messages = {};
    
    function init() {
        ctrl.switcher.type = "switch";
        $translate(["switch_edit", "switch_monitor"]).then(function (results) {
            ctrl.messages = results;
            ctrl.menu = [
                [ctrl.messages.switch_edit, function ($itemScope) {
                    ctrl.editSwitcher();
                }],
                null,
                [ctrl.messages.switch_monitor, function ($itemScope) {
                    ctrl.monitorSwitcher();
                }]
            ];
        });
    }
    
    ctrl.toggleSwitcher = function () {
        ctrl.switcher.value = ctrl.switcher.valueChecked?1:0;
        benoicFactory.setElement(ctrl.switcher.device, 'switch', ctrl.switcher.name, ctrl.switcher.value);
    };
    
    ctrl.editSwitcher = function () {
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'components/switch/switch.modal.html',
            controller: 'SwitchesModalCtrl',
            controllerAs: 'SwitchesModalCtrl',
            size: 'sm',
            resolve: {
                switcher: function () {
                    return ctrl.switcher;
                }
            }
        });
    };
    
    ctrl.monitorSwitcher = function () {
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'components/monitor/monitor.modal.html',
            controller: 'MonitorModalCtrl',
            controllerAs: 'MonitorModalCtrl',
            size: 'sm',
            resolve: {
                element: function () {
                    return ctrl.switcher;
                }
            }
        });
    };
    
    init();
}

angular.module('sagremorApp').component('sagSwitch', {
    templateUrl: 'components/switch/switch.template.html',
    controller: sagSwitchController,
    bindings: {
        switcher: '='
    }
});
