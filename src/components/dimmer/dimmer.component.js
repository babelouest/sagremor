function sagDimmerController (benoicFactory, sagremorParams, $translate) {
    var ctrl = this;
    
    ctrl.dimmer.valueChecked = (ctrl.dimmer.value === 1);
    ctrl.adminMode = sagremorParams.adminMode;
    ctrl.dimmer.newDisplay = ctrl.dimmer.display;
    
    function init() {
        ctrl.dimmer.type = "dimmer";
    }
    
    ctrl.setDimmer = function (value) {
        benoicFactory.setElement(ctrl.dimmer.device, 'dimmer', ctrl.dimmer.name, value).then(function () {
            ctrl.dimmer.value = value;
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
