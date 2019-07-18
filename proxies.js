var ProxyLists = require('proxy-lists');
var rp = require('request-promise');
var fs = require('fs')
var SocksProxyAgent = require('socks-proxy-agent');


var finalProxies = []
var initialProxies = []
var tempProxies = []
function getProxies(){

var options = {
    countries: ['us', 'ca'],
    protocols: ['socks4', 'socks5'],
    sourcesWhiteList: ['hidemyname', 'proxylists-net', 'sockslist'] 

};


var gettingProxies = ProxyLists.getProxies(options);
 
gettingProxies.on('data', function(ps) {

for (var p in ps){
	for (var proto in ps[p].protocols){
	if(!initialProxies.includes(ps[p].protocols[proto] + '://' + ps[p].ipAddress + ':' + ps[p].port.toString())){
		initialProxies.push(ps[p].protocols[proto] + '://' + ps[p].ipAddress + ':' + ps[p].port.toString())
	}
}
}

});
 
gettingProxies.on('error', function(error) {
    // Some error has occurred.
 //   console.error(error);
});
 
gettingProxies.once('end', function() {
	console.log('done')
	tempProxies = initialProxies
	initialProxies = []
	for (var p in tempProxies){
		var proxy = tempProxies[p]
		var agent = new SocksProxyAgent(proxy);

		var options = {
			timeout: 3000,
		    uri: 'https://api.ipify.org?format=json',
		    agent: agent,
		    headers: {
		        'User-Agent': 'Request-Promise'
		    }
		}

	testProxy(options, tempProxies.length, proxy, 0)


	}
    setTimeout(function(){
    	getProxies()
    }, tempProxies.length * 3000)
});

}
function testProxy(options, l, proxy, count){
setTimeout(async function(){
	try {

	    var response = await rp(options)
	    if (JSON.parse(response).ip == proxy.split('://')[1].split(':')[0]){
		
		count++
		if (count <= 3){
		setTimeout(function(){
		return testProxy(options, l, proxy, count)
	}, 1000)
	} 
	
	else if (count > 3){
		finalProxies.push(proxy)
		console.log(finalProxies.length)

		return testProxy(options, l, proxy, count)
}else {
		count = 0
		finalProxies = finalProxies.splice(proxy, 1)
	}
}
	} catch(err) {
		count = 0
		finalProxies = finalProxies.splice(proxy, 1)
	    //console.log(err.message)
	}

}, Math.random * l * 3000)
}
getProxies()

setInterval(function(){
	var text = 'function FindProxyForURL(url, host) {\n\nproxy = "' 
		for (var p in finalProxies){
			text+= 'SOCKS5 ' + finalProxies[p].split('://')[1] + '; SOCKS ' + finalProxies[p].split('://')[1] + '; SOCKS4 ' + finalProxies[p].split('://')[1] + ';'
		}

   		text+='"\n\nreturn proxy;\n\n}'
   		fs.writeFileSync('/home/jarettrsdunn/testnet-inter-exchange-volume-sma-crosses-trader-on-bitmex-/proxies.PAC',text,{encoding:'utf8',flag:'w'})

   	}, 15000)