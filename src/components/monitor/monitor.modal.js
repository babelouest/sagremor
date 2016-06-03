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
                if (!!result && result.length > 0) {
					_.forEach(mediumValues(result, 12), function (monitor) {
						var d = new Date();
						d.setUTCSeconds(monitor.timestamp);
						self.labels.push(d);
						myData.push(monitor.value);
					});
					self.data.push(myData);
				}
            });
        }
        
        function mediumValues(monitorData, nbValues) {
			var subTabLength = Math.round(monitorData.length / nbValues);
			var counter = 0;
			var tmpArray = [];
			var result = [];
			if (monitorData.length <= nbValues) {
				return monitorData;
			}
			_.forEach(monitorData, function(data) {
				tmpArray.push(data);
				counter++;
				if (counter >= subTabLength) {
					tmpArray.sort(function (x, y) {
						return (x.value - y.value);
					});
					result.push(tmpArray[Math.round(tmpArray.length/2)]);
					counter = 0;
					tmpArray = [];
				}
			});
			return result;
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
