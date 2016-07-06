function sagTriggerController ($translate, toaster, angharadFactory, sagremorParams) {
    var ctrl = this;
    
    function init() {
    }
    
    init();
}

angular.module("sagremorApp").component("sagTrigger", {
    templateUrl: "components/event/trigger.template.html",
    controller: sagTriggerController,
    bindings: {
        trigger: "="
    }
})
.run(function(sagGenericInjectorManager) {
    sagGenericInjectorManager.add({
        type: "trigger",
        directive: "sag-trigger"
    });
});
