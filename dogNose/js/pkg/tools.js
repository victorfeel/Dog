var request = require("request");
var cheerio = require("cheerio");
var configM = require("../pkg/config.js");
var tools = {}
tools.parObj = function(data){
	if(typeof(data)!="object"){
		return JSON.parse(data);
	}else{
		return data;
	}
}
var config = tools.parObj(configM).configM;
tools.router = function(app) {
	app.get("/searchOfwd", function(req, res) {
		//response data;
		var data = {},flag=false,j=0,keywd=req.query.wd,type=req.query.type.split(",");
			data.list = [];
		if(keywd==undefined){
			res.send("这位小可爱，你没输入任何字或词或句子！");
			return;
		}
		for(var i=0;i<type.length;i++){
			request(tools.url[type[i]](keywd), function(error, response, body) {
				if(!error && response.statusCode == 200) {
					tools.analysis[type[j]](cheerio.load(body),data.list,keywd);
					j++;
					if(type.length==j){
						j=0;
						res.send(data);
					}
				}
			});
		}
	});
	app.get("/test",function(req,res){
		if(config.ifdebug){
			res.send(req.query);
		}
	});
};
tools.url = {
	//请求URL列表
	baidu:function(wd){
		return "http://www.baidu.com/s?wd="+encodeURI(wd);
	},
	biyin:function(wd){
		return "http://cn.bing.com/search?q=" + encodeURI(wd);
	},
	csdn:function(wd){
		return "http://so.csdn.net/so/search/s.do?q=" + encodeURI(wd);
	}
	
};
tools.analysis = {
	//组织JSON对象
	baidu:function($,jsonobj,keywd){
		$("#content_left").find(".c-container").each(function(i) {
		var obj = {};
		var key = $(this).find("a").text();
			if(key.indexOf(keywd)!=-1){
				obj.title = (key+"").replace(keywd,"<i>"+keywd+"</i>");
			}else{
				return;
			};
			var content = $(this).find(".c-abstract").text();
			if(content==""){
				content = $(this).find(".c-span-last p").eq(0).text();
			}
			obj.img = $(this).find(".c-span6 a").html();
			obj.content = content;
			obj.href = $(this).find("a").attr("href");
			jsonobj.push(obj);
		});
	},
	biyin:function($,jsonobj,keywd){
		$("#b_results").find(".b_algo").each(function(i) {
		var obj = {};
		var key = $(this).find("h2").text();
			if(key.indexOf(keywd)!=-1){
				obj.title = (key+"").replace(keywd,"<i>"+keywd+"</i>");
			}else{
				return;
			}
			obj.href = $(this).find("h2 a").attr("href");
			obj.content = $(this).find(".b_caption p").text();
			obj.date = $(this).find(".b_attribution").html();
			jsonobj.push(obj);
		});
	},
	csdn:function($,jsonobj,keywd){
		$(".search-list-con").find(".search-list").each(function(i) {
		var obj = {};
			var key = $(this).find("dt").text();
			if(key.indexOf(keywd)!=-1){
				obj.title = (key+"").replace(keywd,"<i>"+keywd+"</i>");
			}else{
				return;
			}
			obj.content = $(this).find(".search-detail").text();
			obj.href = $(this).find("dt a").attr("href");
			obj.date = $(this).find(".search-link").text();
			jsonobj.push(obj);
		});
	}
};
//对外提供接口
exports.router = tools.router;