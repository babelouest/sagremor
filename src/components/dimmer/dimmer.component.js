function sagDimmerController (benoicFactory, sagremorParams, $translate) {
    var ctrl = this;
    
    ctrl.element.valueChecked = (ctrl.element.value === 1);
    ctrl.adminMode = sagremorParams.adminMode;
    ctrl.element.newDisplay = ctrl.element.display;
    
    function init() {
        ctrl.element.type = "dimmer";
    }
    
    ctrl.setDimmer = function (value) {
        benoicFactory.setElement(ctrl.element.device, 'dimmer', ctrl.element.name, value).then(function () {
            ctrl.element.value = value;
        });
    };
    
    init();
}

angular.module('sagremorApp').component('sagDimmer', {
    templateUrl: 'components/dimmer/dimmer.template.html',
    controller: sagDimmerController,
    bindings: {
        element: '='
    }
})
.run(function(sagGenericInjectorManager) {
    sagGenericInjectorManager.add({
        type: "dimmer",
        directive: "sag-dimmer"
    });
});
