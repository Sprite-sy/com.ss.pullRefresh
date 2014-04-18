function WPATH(s) {
    var index = s.lastIndexOf("/");
    var path = -1 === index ? "com.ss.pullRefresh/" + s : s.substring(0, index) + "/com.ss.pullRefresh/" + s.substring(index + 1);
    return path;
}

module.exports = [ {
    isClass: true,
    priority: 10000.0002,
    key: "clsPr",
    style: {
        backgroundColor: "white",
        width: Ti.UI.FILL,
        height: Ti.UI.SIZE
    }
}, {
    isClass: true,
    priority: 10000.0003,
    key: "clsPrVInfo",
    style: {
        bottom: 0,
        width: Ti.UI.FILL
    }
}, {
    isClass: true,
    priority: 10000.0004,
    key: "clsPrContainer",
    style: {
        width: Ti.UI.FILL,
        height: Ti.UI.FILL
    }
}, {
    isClass: true,
    priority: 10000.0005,
    key: "clsPrArrow",
    style: {
        image: WPATH("/images/arrow.png"),
        width: 32,
        height: 32,
        bottom: 5,
        left: "8%"
    }
}, {
    isClass: true,
    priority: 10000.0006,
    key: "clsPrLabelContainer",
    style: {
        bottom: 20,
        height: Ti.UI.SIZE
    }
}, {
    isClass: true,
    priority: 10000.0007,
    key: "clsPrStatusLabel",
    style: {
        text: L("prPull", "下拉可以刷新..."),
        width: 200,
        bottom: 35,
        height: Ti.UI.SIZE,
        color: "#858585",
        textAlign: "center",
        font: {
            fontSize: 18,
            fontWeight: "bold"
        }
    }
}, {
    isClass: true,
    priority: 10000.0008,
    key: "clsPrLastUpdatedLabel",
    style: {
        text: L("prLastUpdated", "更新于: "),
        width: 200,
        bottom: 10,
        height: Ti.UI.SIZE,
        color: "#858585",
        textAlign: "center",
        font: {
            fontSize: 14
        }
    }
}, {
    isClass: true,
    priority: 10000.0009,
    key: "clsPrActInd",
    style: {
        left: 20,
        bottom: 13,
        width: 30,
        height: 30,
        style: Ti.UI.ActivityIndicatorStyle.DARK
    }
}, {
    isClass: true,
    priority: 10101.001,
    key: "clsPrActInd",
    style: {
        style: Ti.UI.iPhone.ActivityIndicatorStyle.DARK
    }
}, {
    isClass: true,
    priority: 10101.0011,
    key: "clsImagePrContainer",
    style: {
        width: Ti.UI.FILL,
        height: Ti.UI.FILL
    }
} ];