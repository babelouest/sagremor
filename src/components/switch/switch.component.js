function sagSwitchController (benoicFactory, sagremorParams, $translate) {
    var ctrl = this;
    
    ctrl.switcher.valueChecked = (ctrl.switcher.value === 1);
    ctrl.adminMode = sagremorParams.adminMode;
    ctrl.switcher.newDisplay = ctrl.switcher.display;
    ctrl.messages = {};
    
    function init() {
        ctrl.switcher.type = "switch";
    }
    
    ctrl.toggleSwitcher = function () {
        ctrl.switcher.value = ctrl.switcher.valueChecked?1:0;
        benoicFactory.setElement(ctrl.switcher.device, 'switch', ctrl.switcher.name, ctrl.switcher.value);
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
