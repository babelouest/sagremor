function sagContainerController () {
    var ctrl = this;
    
    function init() {
    }
    
    ctrl.menuSelect = function(menu, component) {
        menu.action(component);
    };
    
    init();
}

angular.module("sagremorApp").component("sagContainer", {
    templateUrl: "components/container/container.template.html",
    controller: sagContainerController,
    transclude: true,
    bindings: {
        menu: "=",
        size: "=",
    }
});
