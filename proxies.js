var ProxyLists = require('proxy-lists');
var SocksProxyAgent = require('socks-proxy-agent');
var rp = require('request-promise');



var options = {
    countries: ['us', 'ca'],
    protocols: ['socks5', 'socks4'],
    sourcesWhiteList: ['proxylists-net',
    					 'sockslist',
    					 'hidemyname']

};
 
var masterProxyList = []
var tempProxyList = []
var goodProxyList = []
async function getProxies(){
	var gettingProxies = ProxyLists.getProxies(options);
gettingProxies.on('data', function(proxies) {
    for (var proxy in proxies){
    	if (!masterProxyList.includes(proxies[proxy].protocols[0]+"://"+proxies[proxy].ipAddress+ ':' + proxies[proxy].port.toString())){
    		masterProxyList.push(proxies[proxy].protocols[0]+"://"+proxies[proxy].ipAddress+ ':' + proxies[proxy].port.toString())
    		console.log(masterProxyList.length	)
    	}
    	
    }
});
 
gettingProxies.on('error', function(error) {
    // Some error has occurred.
    //console.error(error);
});
 
gettingProxies.once('end', async function() {
	console.log('done')
	tempProxyList = masterProxyList
	for (var proxy in tempProxyList){
		var proxy = tempProxyList[proxy]
		var agent = new SocksProxyAgent(proxy);

		var options = {
		    uri: 'https://api.ipify.org?format=json',
		    agent: agent,
		    headers: {
		        'User-Agent': 'Request-Promise'
		    }
		}

		try {
		    var response = await rp(options)
		} catch(err) {
		    console.log(err)
		}

		console.log(JSON.parse(response).ip)  
	}


	masterProxyList = []
	getProxies();


});

}
getProxies();
