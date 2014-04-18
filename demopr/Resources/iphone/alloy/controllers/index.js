function Controller() {
    function onPullrefresh(e) {
        setTimeout(function() {
            e.pr.endRefresh();
        }, 2e3);
    }
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "index";
    arguments[0] ? arguments[0]["__parentSymbol"] : null;
    arguments[0] ? arguments[0]["$model"] : null;
    arguments[0] ? arguments[0]["__itemTemplate"] : null;
    var $ = this;
    var exports = {};
    var __defers = {};
    $.__views.index = Ti.UI.createWindow({
        backgroundColor: "white",
        id: "index"
    });
    $.__views.index && $.addTopLevelView($.__views.index);
    $.__views.pr = Alloy.createWidget("com.ss.pullRefresh", "widget", {
        id: "pr"
    });
    onPullrefresh ? $.__views.pr.on("pullrefresh", onPullrefresh) : __defers["$.__views.pr!pullrefresh!onPullrefresh"] = true;
    var __alloyId5 = [];
    $.__views.__alloyId6 = Ti.UI.createTableViewRow({
        title: "Sprite11111111",
        id: "__alloyId6"
    });
    __alloyId5.push($.__views.__alloyId6);
    $.__views.__alloyId7 = Ti.UI.createTableViewRow({
        title: "Sprite22222222",
        id: "__alloyId7"
    });
    __alloyId5.push($.__views.__alloyId7);
    $.__views.__alloyId8 = Ti.UI.createTableViewRow({
        title: "Sprite33333333",
        id: "__alloyId8"
    });
    __alloyId5.push($.__views.__alloyId8);
    $.__views.__alloyId9 = Ti.UI.createTableViewRow({
        title: "Sprite44444444",
        id: "__alloyId9"
    });
    __alloyId5.push($.__views.__alloyId9);
    $.__views.tb = Ti.UI.createTableView({
        data: __alloyId5,
        headerView: $.__views.pr.getProxyPropertyEx("headerView", {
            recurse: true
        }),
        headerPullView: $.__views.pr.getProxyPropertyEx("headerPullView", {
            recurse: true
        }),
        id: "tb"
    });
    $.__views.index.add($.__views.tb);
    exports.destroy = function() {};
    _.extend($, $.__views);
    $.pr.init({
        table: $.tb
    });
    $.index.open();
    __defers["$.__views.pr!pullrefresh!onPullrefresh"] && $.__views.pr.on("pullrefresh", onPullrefresh);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;