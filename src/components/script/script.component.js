function sagScriptController (benoicFactory, sagremorParams, $translate) {
    var ctrl = this;
    
    function init() {
    }
    
    init();
}

angular.module('sagremorApp').component('sagScript', {
    templateUrl: 'components/script/script.template.html',
    controller: sagScriptController,
    bindings: {
        script: '='
    }
})
.config(function run($translatePartialLoaderProvider) {
	$translatePartialLoaderProvider.addPart("script");
})
.run(function(sagGenericInjectorManager) {
    sagGenericInjectorManager.add({
        type: "mock-service",
        directive: "carleon-mock"
    });
});
