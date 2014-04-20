
A pull refresh widget for IOS and android

    1 use headerView under android
    2 use pullView under IOS
    3 only support table view. if you want to use it in listview check https://github.com/Sprite-sy/TiListViewScrollEvent

usage
   
    1 include <Widget src="com.ss.pullRefresh" id="pr" onPullrefresh="onPullrefresh"/> in alloy XML
    2 add and init call in your code, like:  $.pr.init({ table : parentTableView});
    3 implement your onPullrefresh function. 
    3 demopr include a simple workable sample 
