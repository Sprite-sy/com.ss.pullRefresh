function WPATH(s) {
    var index = s.lastIndexOf("/");
    var path = -1 === index ? "com.ss.pullRefresh/" + s : s.substring(0, index) + "/com.ss.pullRefresh/" + s.substring(index + 1);
    return true && 0 !== path.indexOf("/") ? "/" + path : path;
}

function Controller() {
    function getLastUpdate() {
        var date = new Date();
        return date.getFullYear() + "/" + (date.getMonth() + 1) + "/" + date.getDate() + " " + date.getHours() + ":" + date.getMinutes();
    }
    function setOptions(properties) {
        if (properties) {
            _.extend(_options, properties);
            _inited && _options.showPull(_pullView);
        }
        return;
    }
    function beforeRefresh() {
        if (!_options.canRefresh) return;
        _reloading = true;
        _options.showUpdating(_pullView);
        if (P.isIOS) {
            _parentView.setContentInsets({
                top: 90
            }, {
                animated: true
            });
            console.log("beforeRefresh" + _options.height);
        }
        refresh();
    }
    function refresh() {
        if (!_options.canRefresh) return;
        $.trigger("pullrefresh", {
            pr: $
        });
    }
    function endRefresh() {
        if (!_options.canRefresh) return;
        _options.showUpdated(_pullView);
        setTimeout(function() {
            if (P.isIOS) {
                _parentView.setContentInsets({
                    top: 0
                }, {
                    animated: true
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
    function scrollendListener() {
        if (P.isAndroid) {
            if (_firstVisibleItem) return;
            if (_pulling && !_reloading) {
                _pulling = false;
                beforeRefresh();
            } else {
                console.log("touchendListener scrollTop" + _pulling + " reloading:" + _reloading);
                setTimeout(function() {
                    disablePullView();
                }, 100);
            }
        }
        return;
    }
    function scrollListener(e) {
        if (_reloading) return;
        var offset = 0;
        if (P.isIOS) {
            if (!e.contentOffset) return;
            offset = e.contentOffset.y;
            var pv = _options.height / 3;
            if (-pv >= offset && !_pulling && !_reloading) {
                _pulling = true;
                _options.showRelease(_pullView);
                return;
            }
            if (_pulling && offset > -pv && 0 > offset && !_reloading) {
                _pulling = false;
                _options.showPull(_pullView);
                return;
            }
        } else {
            _firstVisibleItem = e.firstVisibleItem;
            if (0 === _firstVisibleItem && _pullViewEnabled) {
                var ph = .75 * _options.height;
                offset = _options.height + _parentView.headerView.rect.y;
                if (offset > ph && !_pulling && !_reloading) {
                    _pulling = true;
                    _options.showRelease(_pullView);
                } else if (_pulling && ph >= offset && !_reloading) {
                    _pulling = false;
                    _options.showPull(_pullView);
                }
            }
            if (_firstVisibleItem && _touchEnabled) {
                _parentView.removeEventListener("touchmove", touchmoveListener);
                _parentView.removeEventListener("touchstart", touchstartListener);
                _touchEnabled = false;
            }
            if (0 === _firstVisibleItem && false === _touchEnabled) {
                _parentView.addEventListener("touchmove", touchmoveListener);
                _parentView.addEventListener("touchstart", touchstartListener);
                _touchEnabled = true;
            }
        }
    }
    function touchstartListener(e) {
        if (_reloading) return;
        _lastTouchOffsetY = e.y;
    }
    function touchmoveListener(e) {
        if (_reloading || _firstVisibleItem) return;
        var offset = e.y;
        var ph = .35 * _options.height;
        offset - _lastTouchOffsetY > ph && enablePullView();
    }
    function dragendListener() {
        if (_pulling && !_reloading) {
            _pulling = false;
            beforeRefresh();
        }
        return;
    }
    function disablePullView() {
        if (P.isIOS) return;
        if (false === _pullViewEnabled) return;
        _parentView.scrollToTop(1);
        $.container.height = 0;
        _pullViewEnabled = false;
    }
    function enablePullView() {
        if (true === _pullViewEnabled) return;
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
            _parentView.addEventListener("touchmove", touchmoveListener);
            _parentView.addEventListener("touchstart", touchstartListener);
            disablePullView();
        } else _parentView.addEventListener("dragend", dragendListener);
        _parentView.addEventListener("scroll", scrollListener);
        _parentView.addEventListener("scrollend", scrollendListener);
        P.isIOS ? _parentView.headerPullView = $.view : _parentView.headerView = $.view;
    }
    new (require("alloy/widget"))("com.ss.pullRefresh");
    this.__widgetId = "com.ss.pullRefresh";
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "widget";
    arguments[0] ? arguments[0]["__parentSymbol"] : null;
    arguments[0] ? arguments[0]["$model"] : null;
    arguments[0] ? arguments[0]["__itemTemplate"] : null;
    var $ = this;
    var exports = {};
    $.__views.view = Ti.UI.createView({
        backgroundColor: "white",
        width: Ti.UI.FILL,
        height: Ti.UI.SIZE,
        id: "view"
    });
    $.__views.container = Ti.UI.createView({
        width: Ti.UI.FILL,
        height: Ti.UI.FILL,
        id: "container"
    });
    $.__views.view.add($.__views.container);
    $.__views.vInfo = Ti.UI.createView({
        bottom: 0,
        width: Ti.UI.FILL,
        id: "vInfo"
    });
    $.__views.container.add($.__views.vInfo);
    $.__views.arrow = Ti.UI.createImageView({
        image: WPATH("/images/arrow.png"),
        width: 32,
        height: 32,
        bottom: 5,
        left: "8%",
        id: "arrow"
    });
    $.__views.vInfo.add($.__views.arrow);
    $.__views.actInd = Ti.UI.createActivityIndicator({
        left: 20,
        bottom: 13,
        width: 30,
        height: 30,
        style: Ti.UI.ActivityIndicatorStyle.DARK,
        id: "actInd"
    });
    $.__views.vInfo.add($.__views.actInd);
    $.__views.statusLabel = Ti.UI.createLabel({
        text: L("prPull", "下拉可以刷新..."),
        width: 200,
        bottom: 35,
        height: Ti.UI.SIZE,
        color: "#858585",
        textAlign: "center",
        font: {
            fontSize: 18,
            fontWeight: "bold"
        },
        id: "statusLabel"
    });
    $.__views.vInfo.add($.__views.statusLabel);
    $.__views.lastUpdatedLabel = Ti.UI.createLabel({
        text: L("prLastUpdated", "更新于: "),
        width: 200,
        bottom: 10,
        height: Ti.UI.SIZE,
        color: "#858585",
        textAlign: "center",
        font: {
            fontSize: 14
        },
        id: "lastUpdatedLabel"
    });
    $.__views.vInfo.add($.__views.lastUpdatedLabel);
    $.__views.view && $.addProxyProperty("headerView", $.__views.view);
    exports.destroy = function() {};
    _.extend($, $.__views);
    var P = {
        isAndroid: true,
        isIOS: false
    };
    var _options = {
        msgPull: L("prPull", "下拉可以刷新..."),
        msgRelease: L("prRelease", "松开可以刷新..."),
        msgUpdating: L("prUpating", "加载中..."),
        msgUpdated: L("prUpated", "更新完成"),
        msgLastUpdated: L("prLastUpdated", "更新于: "),
        canRefresh: true,
        height: 90,
        showPull: function(pv) {
            _pullStatus = "pull";
            pv.arrow.opacity = 1;
            pv.arrow.show();
            var t = Ti.UI.create2DMatrix();
            t = t.rotate(0);
            _pullView.arrow.animate({
                transform: t,
                duration: 180
            });
            pv.statusLabel.text = _options.msgPull;
            pv.lastUpdatedLabel.text = _options.msgLastUpdated + getLastUpdate();
        },
        showRelease: function(pv) {
            _pullStatus = "release";
            var t = Ti.UI.create2DMatrix();
            t = t.rotate(180);
            pv.arrow.animate({
                transform: t,
                duration: 180
            });
            pv.statusLabel.text = _options.msgRelease;
            pv.lastUpdatedLabel.text = _options.msgLastUpdated + getLastUpdate();
        },
        showUpdating: function(pv) {
            _pullStatus = "updating";
            pv.arrow.opacity = 0;
            pv.arrow.hide();
            pv.actInd.show();
            pv.statusLabel.text = _options.msgUpdating;
            pv.arrow.transform = Ti.UI.create2DMatrix();
        },
        showUpdated: function(pv) {
            _pullStatus = "updated";
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
    var _pulling = false;
    var _reloading = false;
    var _firstVisibleItem = 0;
    var _pullStatus = "pull";
    var _lastTouchOffsetY = 0;
    var _pullViewEnabled = null;
    var _touchEnabled = true;
    exports.setOptions = setOptions;
    exports.endRefresh = endRefresh;
    exports.init = init;
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;