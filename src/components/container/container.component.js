function sagContainerController () {
    var ctrl = this;
    
    function init() {
    }
    
    ctrl.menuSelect = function(menuItem, element) {
        menuItem.action(element);
    };
    
    init();
}

angular.module("sagremorApp").component("sagContainer", {
    templateUrl: "components/container/container.template.html",
    controller: sagContainerController,
    transclude: true,
    bindings: {
        menu: "=",
        title: "=",
        size: "=",
        element: "="
    }
});
