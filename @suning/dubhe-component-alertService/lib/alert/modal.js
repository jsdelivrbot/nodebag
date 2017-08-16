'use strict';

exports.__esModule = true;

var _alertService = require('./alertService');

var _alertService2 = _interopRequireDefault(_alertService);

var _dialogService = require('./dialogService');

var _dialogService2 = _interopRequireDefault(_dialogService);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (app) {
	(0, _alertService2.default)(app);
	(0, _dialogService2.default)(app);
};
//# sourceMappingURL=modal.js.map