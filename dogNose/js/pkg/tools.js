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
		for(var i=0,l=type.length;i<l;i++){
			var _request = request.defaults({jar: true});
			var strUrl = tools.url[type[i]](keywd);
			var options = {
		        url: strUrl,
		        method: 'GET',
		        headers: config.headers
		        //sendImmediately: false  //默认为真，发送一个基本的认证header。设为false之后，收到401会重试（服务器的401响应必须包含WWW-Authenticate指定认证方法）。
		    };
			_request(options, function(error, response, body) {
				if(!error && response.statusCode == 200) {
					tools.analysis[type[j]](cheerio.load(body),data.list,keywd);
					j++;
					if(type.length==j){
						j=0;
						res.send(data);
					}
				}else{
					res.send(data);
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
	bd:function(wd){
		return config.to["bd"]+""+encodeURI(wd)+"&timeD="+tools.getTime();
	},
	by:function(wd){
		return config.to["by"]+""+encodeURI(wd)+"&timeD="+tools.getTime();
	},
	cn:function(wd){
		return config.to["cn"]+""+ encodeURI(wd)+"&timeD="+tools.getTime();
	},
	oh:function(wd){
		return config.to["oh"]+""+ encodeURI(wd)+"&timeD="+tools.getTime();
	}
};
tools.getTime=function(){
	return new Date().getTime();
}
tools.analysis = {
	//组织JSON对象
	bd:function($,jsonobj,keywd){
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
			obj.content = content;
			obj.href = $(this).find("a").attr("href");
			obj.sourse = "baidu";
			jsonobj.push(obj);
		});
	},
	by:function($,jsonobj,keywd){
		$("#b_results").find(".b_algo").each(function(i) {
		var obj = {};
		var key = $(this).find("h2").text();
			if(key.indexOf(keywd)!=-1){
				obj.title = (key+"").replace(keywd,"<i>"+keywd+"</i>");
			}else{
				return;
			}
			obj.content = $(this).find(".b_caption p").text();
			obj.href = $(this).find("h2 a").attr("href");
			obj.sourse = "biyin";
			jsonobj.push(obj);
		});
	},
	cn:function($,jsonobj,keywd){
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
			obj.sourse = "csdn";
			jsonobj.push(obj);
		});
	},
	oh:function($,jsonobj,keywd){
		$("#results").find("li").each(function(i) {
		var obj = {};
			var key = $(this).find("h3").text();
			if(key.indexOf(keywd)!=-1){
				obj.title = (key+"").replace(keywd,"<i>"+keywd+"</i>");
			}else{
				return;
			}
			obj.href = $(this).find("h3 a").attr("href");
			obj.content = $(this).find(".outline").text();
			obj.sourse = "oschina";
			jsonobj.push(obj);
		});
	}
};
//对外提供接口
exports.router = tools.router;