function sagEventController ($translate, toaster, angharadFactory, sagremorParams) {
    var ctrl = this;
    
    function init() {
    }
    
    init();
}

angular.module("sagremorApp").component("sagEvent", {
    templateUrl: "components/script/event.template.html",
    controller: sagEventController,
    bindings: {
        event: "="
    }
})
.config(function run($translatePartialLoaderProvider) {
	$translatePartialLoaderProvider.addPart("event");
})
.run(function(sagGenericInjectorManager) {
    sagGenericInjectorManager.add({
        type: "event",
        directive: "sag-event"
    });
});
