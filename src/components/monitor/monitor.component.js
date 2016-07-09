function sagMonitorController ($translate, toaster, angharadFactory, sagremorParams) {
    var ctrl = this;
    
    function init() {
    }
    
    init();
}

angular.module("sagremorApp").component("sagMonitor", {
    templateUrl: "components/monitor/monitor.template.html",
    controller: sagMonitorController,
    bindings: {
        element: "="
    }
})
.run(function(sagGenericInjectorManager) {
    sagGenericInjectorManager.add({
        type: "monitor",
        directive: "sag-monitor"
    });
});
