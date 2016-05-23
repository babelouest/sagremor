angular.module('sagremorApp')
    .controller('MonitorModalCtrl', [
    '$scope',
    '$uibModalInstance',
    'toaster',
    'angharadConstant',
    'benoicFactory',
    'element',
    function($scope, $uibModalInstance, toaster, angharadConstant, benoicFactory, element) {
        var self = this;
        
        this.element = element;
        this.labels = [];
        this.series = [element.display];
        this.data = [];
        
        function init() {
            benoicFactory.getMonitor(element.device, element.type, element.name).then(function (result) {
                var myData = [];
                _.forEach(result, function (monitor) {
                    var d = new Date();
                    d.setUTCSeconds(monitor.timestamp);
                    self.labels.push(d);
                    myData.push(monitor.value);
                });
                self.data.push(myData);
            });
        }
        
        this.onClick = function (points, evt) {
          console.log(points, evt);
        };
        
        this.close = function () {
            $uibModalInstance.dismiss('close');
        };
        
        init();
    }
]);
