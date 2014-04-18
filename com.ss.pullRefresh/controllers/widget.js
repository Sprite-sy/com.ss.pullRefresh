var P = {
	isAndroid : (Ti.Platform.osname == 'android') ? true : false,
	isIOS : (Ti.Platform.osname == 'iphone') ? true : false
};

var _options = {
	msgPull : L('prPull', '下拉可以刷新...'),
	msgRelease : L('prRelease', '松开可以刷新...'),
	msgUpdating : L('prUpating', '加载中...'),
	msgUpdated : L('prUpated', '更新完成'),
	msgLastUpdated : L('prLastUpdated', '更新于: '),

	canRefresh : true,
	height : 90,
	showPull : function(pv) {
		_pullStatus = 'pull';
		pv.arrow.opacity = 1;
		pv.arrow.show();
		var t = Ti.UI.create2DMatrix();
		t = t.rotate(0);
		_pullView.arrow.animate({
			transform : t,
			duration : 180
		});
		pv.statusLabel.text = _options.msgPull;
		pv.lastUpdatedLabel.text = _options.msgLastUpdated + getLastUpdate();
	},
	showRelease : function(pv) {
		_pullStatus = 'release';
		var t = Ti.UI.create2DMatrix();
		t = t.rotate(180);
		pv.arrow.animate({
			transform : t,
			duration : 180
		});
		pv.statusLabel.text = _options.msgRelease;
		pv.lastUpdatedLabel.text = _options.msgLastUpdated + getLastUpdate();
	},
	showUpdating : function(pv) {
		_pullStatus = 'updating';
		pv.arrow.opacity = 0;
		pv.arrow.hide();
		pv.actInd.show();
		pv.statusLabel.text = _options.msgUpdating;
		pv.arrow.transform = Ti.UI.create2DMatrix();
	},
	showUpdated : function(pv) {
		_pullStatus = 'updated';
		pv.lastUpdatedLabel.text = _options.msgLastUpdated + getLastUpdate();
		pv.statusLabel.text = _options.msgUpdated;
		pv.actInd.hide();
		pv.arrow.opacity = 0;
		pv.arrow.hide();
	}
};

var _inited = false;
var _parentView = null;
var _pullView = null;
var _moreView = null;
var _pulling = false;
var _reloading = false;
var _scrollOffsetY = 0;
var _firstVisibleItem = 0;
var _pullStatus = "pull";
var _lastTouchOffsetY = 0;
var _pullViewEnabled = null;
var _touchEnabled = true;

function getLastUpdate() {
	//implement your own
	var date = new Date();
	return date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes();
}

function setOptions(properties) {
	if (properties) {
		_.extend(_options, properties);
		_inited && _options.showPull(_pullView);
	}
	return;
}

function beforeRefresh() {
	if (!_options.canRefresh) {
		return;
	}
	_reloading = true;
	_options.showUpdating(_pullView);
	if (P.isIOS) {
		_parentView.setContentInsets({
			top : 90,
		}, {
			animated : true
		});
		console.log("beforeRefresh" + _options.height);
	}
	refresh();
}

function refresh() {
	if (!_options.canRefresh) {
		return;
	}

	$.trigger('pullrefresh', {
		pr : $
	});
}

function endRefresh() {
	if (!_options.canRefresh) {
		return;
	}

	_options.showUpdated(_pullView);
	setTimeout(function() {
		if (P.isIOS) {
			_parentView.setContentInsets({
				top : 0
			}, {
				animated : true
			});
			_options.showPull(_pullView);
		}

		if (P.isAndroid) {
			console.log("endRefresh scrollToTop");
			_options.showPull(_pullView);
			disablePullView();
		}
		_reloading = false;
	}, 600);
}

function scrollendListener(e) {
	if (P.isAndroid) {
		if (_firstVisibleItem)
			return;
		if (_pulling && !_reloading) {
			_pulling = false;
			beforeRefresh();
		} else {
			console.log("touchendListener scrollTop" + _pulling + ' reloading:' + _reloading);
			setTimeout(function() {
				disablePullView();
			}, 100);
		}
	}

	return;
}

function scrollListener(e) {
	if (_reloading) {
		return;
	}

	var offset = 0;
	if (P.isIOS) {
		if (!e.contentOffset) {
			return;
		}
		offset = e.contentOffset.y;
		var pv = _options.height / 3;
		if (offset <= -pv && !_pulling && !_reloading) {
			_pulling = true;
			_options.showRelease(_pullView);
			return;
		} else if (_pulling && (offset > -pv && offset < 0) && !_reloading) {
			_pulling = false;
			_options.showPull(_pullView);
			return;
		}
	} else {
		_firstVisibleItem = e.firstVisibleItem;
		if (0 === _firstVisibleItem && _pullViewEnabled) {
			var ph = _options.height * 0.75;
			offset = _options.height + _parentView.headerView.rect.y;

			if (offset > ph && !_pulling && !_reloading) {
				_pulling = true;
				_options.showRelease(_pullView);
			} else if (_pulling && (offset <= ph) && !_reloading) {
				_pulling = false;
				_options.showPull(_pullView);
			}
			//console.log('view scroll ' + _pullViewEnabled + '  ' + _pullStatus + ' ' + offset + ' ' + ph);
		}

		//touch enable?
		if (_firstVisibleItem && _touchEnabled) {
			_parentView.removeEventListener('touchmove', touchmoveListener);
			_parentView.removeEventListener('touchstart', touchstartListener);
			_touchEnabled = false;
		}
		if (0 === _firstVisibleItem && false === _touchEnabled) {
			_parentView.addEventListener('touchmove', touchmoveListener);
			_parentView.addEventListener('touchstart', touchstartListener);
			_touchEnabled = true;
		}
	}
}

function touchendListener(e) {
	//for andoid
	_lastTouchOffsetY = 0;
	console.log("touchendListener _pullling" + _pulling + ' reloading:' + _reloading);
	if (_pulling && !_reloading) {
		_pulling = false;
		beforeRefresh();
	} else {
		if (0 === _firstVisibleItem) {
			console.log("touchendListener scrollTop" + _pulling + ' reloading:' + _reloading);
			setTimeout(function() {
				disablePullView();
			}, 100);
		}
	}

	return;
}

function touchstartListener(e) {
	if (_reloading) {
		return;
	}
	_lastTouchOffsetY = e.y;
}

function touchmoveListener(e) {
	if (_reloading || _firstVisibleItem) {
		return;
	}
	var offset = e.y;
	var ph = _options.height * 0.35;

	if (offset - _lastTouchOffsetY > ph) {
		enablePullView();
	}
}

function dragendListener(e) {
	//console.log("dragendListener _pullling" + _pulling + ' reloading:' + _reloading);
	if (_pulling && !_reloading) {
		_pulling = false;
		beforeRefresh();
	}
	return;
}

function disablePullView() {
	if (P.isIOS) {
		return;
	}
	if (false === _pullViewEnabled)
		return;
	//console.log('disablePullView');
	_parentView.scrollToTop(1);
	$.container.height = 0;
	_pullViewEnabled = false;
}

function enablePullView() {
	if (true === _pullViewEnabled)
		return;
	$.container.height = _options.height;
	_parentView.scrollToTop(1);
	_pullViewEnabled = true;
}

function init(args) {
	console.log("PR INIT");
	args = args || {};
	setOptions(args);

	_parentView = args["table"];
	_pullView = $;
	_inited = true;

	if (P.isAndroid) {
		_parentView.addEventListener('touchmove', touchmoveListener);
		_parentView.addEventListener('touchstart', touchstartListener);
		disablePullView();
	} else {
		_parentView.addEventListener('dragend', dragendListener);
	}
	_parentView.addEventListener('scroll', scrollListener);
	_parentView.addEventListener('scrollend', scrollendListener);

	if (P.isIOS) {
		_parentView.headerPullView = $.view;
	} else {
		_parentView.headerView = $.view;
	}
}

exports.setOptions = setOptions;
exports.endRefresh = endRefresh;
exports.init = init;
