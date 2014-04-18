function onPullrefresh(e) {
	setTimeout(function(){
		e.pr.endRefresh();
	}, 2000);
}

$.pr.init({
	table : $.tb
});

$.index.open();
