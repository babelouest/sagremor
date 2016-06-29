function sagScriptController ($translate, toaster, angharadFactory, sagremorParams) {
    var ctrl = this;
    
    function init() {
    }
    
    this.runScript = function 	() {
		angharadFactory.runScript(ctrl.script.name).then(function () {
			toaster.pop("success", $translate.instant("script_run", {name: ctrl.script.name}), $translate.instant("script_run_success"));
		}, function (error) {
			toaster.pop("error", $translate.instant("script_run", {name: ctrl.script.name}), $translate.instant("script_run_error"));
		});
	};
    
    init();
}

angular.module("sagremorApp").component("sagScript", {
    templateUrl: "components/script/script.template.html",
    controller: sagScriptController,
    bindings: {
        script: "="
    }
})
.config(function run($translatePartialLoaderProvider) {
	$translatePartialLoaderProvider.addPart("script");
})
.run(function(sagGenericInjectorManager) {
    sagGenericInjectorManager.add({
        type: "script",
        directive: "sag-script"
    });
});
