angular.module("sagremorApp")
    .controller("MonitorModalCtrl",
    function($scope, $uibModalInstance, $translate, toaster, benoicFactory, sagremorConstant, element) {
        var self = this;
        
        this.element = element;
        this.series = [element.display];
        this.data = [];
        this.labels = [];
        this.durationList = sagremorConstant.durationList;
        this.duration = {value: 4};
        
		this.options = {
			responsive: true,
			tooltips: {
				callbacks: {
					label: function(tooltipItem, data) {
						return tooltipItem.yLabel + " " + element.options.unit;
					}
				}
			},
			scales: {
				xAxes: [{
					type: "time",
					display: true,
					time: {
						tooltipFormat: "YYYY/MM/DD hh:mm"
					}
				}],
				yAxes: [{
					scaleLabel: {
						display: true,
						labelString: element.options.unit
					}
				}]
			},
			elements: {
				line: {
					lineTension: 0.4
				},
				point: {
					radius: 0
				}
			}
		};
    
        function init() {
			self.getMonitor();
        }
        
        this.getMonitor = function () {
			var from = new Date();
			
			switch (self.duration.value) {
				case 0:
					from.setTime(from.getTime() - 1*60*60*1000);
					break;
				case 1:
					from.setTime(from.getTime() - 2*60*60*1000);
					break;
				case 2:
					from.setTime(from.getTime() - 6*60*60*1000);
					break;
				case 3:
					from.setTime(from.getTime() - 12*60*60*1000);
					break;
				case 4:
					from.setTime(from.getTime() - 24*60*60*1000);
					break;
				case 5:
					from.setTime(from.getTime() - 48*60*60*1000);
					break;
				case 6:
					from.setTime(from.getTime() - 72*60*60*1000);
					break;
				case 7:
					from.setTime(from.getTime() - 168*60*60*1000);
					break;
				case 8:
					from.setMonth(from.getMonth() - 1);
					break;
			}
			
            benoicFactory.getMonitor(element.device, element.type, element.name, Math.round(from.getTime() / 1000)).then(function (result) {
                self.data = [];
                self.labels = [];
                var myData = [];
                if (!!result && result.length > 0) {
					_.forEach(result, function (monitor) {
						self.labels.push(new Date(monitor.timestamp * 1000));
						myData.push(monitor.value);
					});
					self.data.push(myData);
				}
            });
		}
        
        this.tr = function (value) {
			return $translate.instant(value);
		};
        
        this.close = function () {
            $uibModalInstance.dismiss("close");
        };
        
        this.displayTitle = function () {
			return $translate.instant("monitor_title") + element.display;
		};
		
        init();
    }
);
