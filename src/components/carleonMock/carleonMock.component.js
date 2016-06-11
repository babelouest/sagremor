function carleonMockController (carleonFactory, sagremorParams, $translate, toaster) {
    var ctrl = this;
    
    ctrl.adminMode = sagremorParams.adminMode;
    ctrl.param = {};
    ctrl.commandList = ['command1', 'command2', 'command3'];
    ctrl.messages = {};
    
    function init() {
    }
    
    ctrl.command = function () {
		carleonFactory.commandMock(ctrl.mock.name, ctrl.param.command, ctrl.param.param1, ctrl.param.param2, ctrl.param.param3).then(function (result) {
			toaster.pop("success", ctrl.messages.carleon_mock_command, ctrl.messages.carleon_mock_command_success);
		}, function (error) {
			toaster.pop("error", ctrl.messages.carleon_mock_command, ctrl.messages.carleon_mock_command_success);
		});
	};
    
    init();
}

angular.module('sagremorApp').component('carleonMock', {
    templateUrl: 'components/carleonMock/carleonMock.template.html',
    controller: carleonMockController,
    bindings: {
        mock: '='
    }
});
