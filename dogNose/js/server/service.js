var express = require("express");
var pkgtools = require("../pkg/tools.js");
var app = express();
var server = app.listen(8081,function(){
	console.log("server is starting...port:8081");
});
//allow custom header and CORS
app.all('*',function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
  res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
  if (req.method == 'OPTIONS') {
    res.send(200); /让options请求快速返回/
  }else {
    next();
  }
});
pkgtools.router(app);//启动路由
