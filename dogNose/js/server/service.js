var express = require("express");
var request = require("request");
var cheerio = require("cheerio");
var app = express();
var server = app.listen(8081,function(){
	console.log("server is starting...");
});
app.get("/",function(req,res){
	 request("http://www.baidu.com/s?wd=ssss",function(error,response,body){
	 	if (!error && response.statusCode == 200) {
	 		 var $ = cheerio.load(body); //当前的$符相当于拿到了所有的body里面的选择器
	 		 var navText = $("body").html();
	 		 res.send(navText);
	 	}
	 });
});
app.get("/query/:wd/:sex",function(req,res){
	var url = "http://www.baidu.com/s?wd="+req.params.wd
	 request(url,function(error,response,body){
	 	if (!error && response.statusCode == 200) {
	 		 var $ = cheerio.load(body); //当前的$符相当于拿到了所有的body里面的选择器
	 		 var navText = $("#content_left").html();
	 		 res.send(navText);
	 	}
	 });
	 console.log("name："+req.params.name);
	 console.log("sex："+req.params.sex);
});