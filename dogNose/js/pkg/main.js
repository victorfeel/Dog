$(function() {
	var objM = new M();
	objM.init();
});
var M = function() {};
M.prototype.inputData = function() {
	var data = {
		el: '#index',
		data: {
			togo: "bd",
			wd: "",
		}
	}
	return data;
}
//init listen and init data
M.prototype.init = function() {
	//初始化数据
	var vue = new Vue(M.prototype.inputData());
	$("#index").on("click", "#btn", function() {
		$("#result").attr("src", config.togo["bd"]);
		M.tools.findDom();
	});
}
 //tools class
M.tools = {
	parseObj: function(jsondata) {
		var data = null;
		if(typeof jsondata != "object") {
			data = JSON.parse(jsondata);
		} else {
			data = JSON.stringify(jsondata);
			data = JSON.parse(data);
		}
		return data;
	},
	findDom:function(){
		console.log($("#result").contents().find("body").html());
	},
}