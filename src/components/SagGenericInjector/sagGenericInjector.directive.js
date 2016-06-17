angular.module('sagremorApp').directive('sagGenericInjector', function ($compile, sagGenericInjectorManager) {
    
    var template = "<directive element='elt'></directive>";
    
    var templateNotFound = "<p>Not found!</p>";
     
    return{
        scope: {
            type: "=",
            elt: "="
        },
        link: function(scope, element) {
            var config = _.find(sagGenericInjectorManager.components, {type: scope.type});
            var content;
            if (!!config) {
                content = $compile(template.replace(/directive/g, config.directive))(scope);
            } else {
                content = $compile(templateNotFound)(scope);
            }
            element.append(content);
        }
    }});
