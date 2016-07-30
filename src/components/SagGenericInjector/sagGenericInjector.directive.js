angular.module("sagremorApp").directive("sagGenericInjector", function ($compile, sagGenericInjectorManager, carleonComponentsConfig) {
    
    var template = "<directive element=\"elt\"></directive>";
    
    var templateNotFound = "<div class=\"container has-error\" data-translate=\"injector_not_found\"></div>";
     
    var templateDisabled = "<div class=\"container has-error\" data-translate=\"injector_disabled\"></div>";
     
    return{
        scope: {
            type: "=",
            elt: "="
        },
        link: function(scope, element) {
            var config = _.find(sagGenericInjectorManager.components, {type: scope.type});
            if (!!config) {
				if (config.carleonService) {
					if (!!carleonComponentsConfig[scope.type] && !!carleonComponentsConfig[scope.type].enabled) {
						content = $compile(template.replace(/directive/g, config.directive))(scope);
					} else {
						content = $compile(templateDisabled)(scope);
					}
				} else {
					content = $compile(template.replace(/directive/g, config.directive))(scope);
				}
            } else {
                content = $compile(templateNotFound)(scope);
            }
            element.append(content);
        }
    }});
