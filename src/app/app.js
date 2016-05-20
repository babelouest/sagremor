angular.module('sagremorApp', ['ui.bootstrap', 'ui.router', 'ngCookies', 'frapontillo.bootstrap-switch', 'toaster', 'ui.bootstrap.contextMenu', 'pascalprecht.translate'])
    .constant('_', window._)
    .constant('angharadConstant', {
        'baseUrl': 'https://hunbaut.babelouest.org/angharaddev/',
        //'baseUrl': 'http://localhost:2473/',
        'prefixAngharad': 'angharad/',
        'prefixBenoic': 'benoic/',
        'preficCarleon': 'carleon/',
        'monitoredEveryEnum': [
            {value: 60, label: "1 minute"},
            {value: 120, label: "2 minutes"},
            {value: 300, label: "5 minutes"},
            {value: 600, label: "10 minutes"},
            {value: 900, label: "15 minutes"},
            {value: 1200, label: "20 minutes"},
            {value: 1800, label: "30 minutes"},
            {value: 3600, label: "1 hour"},
            {value: 7200, label: "2 hours"},
            {value: 10800, label: "3 hours"},
            {value: 14400, label: "4 hours"},
            {value: 18000, label: "5 hours"},
            {value: 21600, label: "6 hours"},
            {value: 43200, label: "12 hours"},
            {value: 86400, label: "1 day"}
        ]
    })
    .config(['$translateProvider', function ($translateProvider) {
        var translations = {
            HEADLINE: 'What an awesome module!',
            PARAGRAPH: 'Srsly!',
            NAMESPACE: {
                PARAGRAPH: 'And it comes with awesome features!'
            },
            plop: "plop go"
        };
        // add translation table
        $translateProvider
        .translations('en', translations)
        .preferredLanguage('en');
        $translateProvider.useSanitizeValueStrategy('escape');
    }])
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
    })
    .factory('sagremorParams', function () {
        var params = {};
        
        return params;
    })
    .factory('sagremorConfirm', function ($uibModal) {
        
        var open = function (title, message) {
            return modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'components/confirm/confirm.modal.html',
                controller: 'ConfirmModalCtrl',
                controllerAs: 'ConfirmModalCtrl',
                size: 'sm',
                resolve: {
                    title: function () {
                        return title;
                    },
                    message: function () {
                        return message;
                    }
                }
            }).result;
        };
        
        return {open: open};
    });
