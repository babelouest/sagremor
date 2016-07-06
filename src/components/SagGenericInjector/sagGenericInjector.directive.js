angular.module('sagremorApp').directive('sagGenericInjector', function ($compile, sagGenericInjectorManager) {
    
    var template = "<directive element='elt'></directive>";
    
    var templateNotFound = "<div class=\"has-error\" data-translate=\"injector_not_found\"></div>";
     
    return{
        scope: {
            type: "=",
            elt: "="
        },
        link: function(scope, element) {
            var config = _.find(sagGenericInjectorManager.components, {type: scope.type});
            if (!!config) {
                content = $compile(template.replace(/directive/g, config.directive))(scope);
            } else {
				console.log(scope.type, scope.elt);
                content = $compile(templateNotFound)(scope);
            }
            element.append(content);
        }
    }});
