var configM = {
		headers: {'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2490.80 Safari/537.36'}, //线上正式环境
		backUrl: "http://webapp.1680210.com/kai-bms/", //线上正式环境
		ifdebug: true, //当为true的时候是调试模式
		to: {//检索URL
			bd: "http://www.baidu.com/s?wd=",
			by: "http://cn.bing.com/search?q=",
			cn: "http://so.csdn.net/so/search/s.do?q=",
			oh: "http://www.oschina.net/search?scope=all&fromerr=QvHd9Nyz&q=",
		}
	}
//对外提供接口
exports.configM = configM;