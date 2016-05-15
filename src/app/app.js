angular.module('sagremorApp', ['ui.router', 'ngCookies', 'frapontillo.bootstrap-switch'])
    .constant('_', window._)
    .constant('angharadConstant', {
        'baseUrl': 'https://hunbaut.babelouest.org/angharaddev/',
        //'baseUrl': 'http://localhost:2473/',
        'prefixAngharad': 'angharad/',
        'prefixBenoic': 'benoic/',
        'preficCarleon': 'carleon/'
    })
    .factory('sharedData', function() {
        var sharedData = {};
        
        var add = function(share, name, data) {
            if (!sharedData[share]) {
                sharedData[share] = {};
            }
            sharedData[share][name] = data;
        };
        
        var get = function(share, name) {
            return sharedData[share][name];
        };
        
        var remove = function(share, name) {
            return delete sharedData[share][name];
        };
        
        var all = function(share) {
            return sharedData[share];
        };
        
        return {
            all: all,
            get: get,
            add: add,
            remove: remove
        };
    });
