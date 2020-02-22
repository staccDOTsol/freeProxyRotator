var ProxyLists = require('proxy-lists');
var rp = require('request-promise');
var fs = require('fs')
var SocksProxyAgent = require('socks-proxy-agent');
var HttpsProxyAgent = require('https-proxy-agent');


var finalProxies = []
var initialProxies = []
var tempProxies = []
function getProxies(){

var options = {
    countries: ['us', 'ca'],
    protocols: ['http', 'https'],
    sourcesWhiteList: [
  'freeproxylist',
  'proxy-list-org',
  'proxydb',
  'proxyhttp-net',
  'hidemyname'
] 

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
		console.log(tempProxies.length)	

	for (var p in tempProxies){
		var proxy = tempProxies[p]
		var agent = new HttpsProxyAgent(proxy);

		var options = {
			timeout: 3000,
		    uri: 'https://api.ipify.org?format=json',
		    headers: {
		        'User-Agent': 'Request-Promise'
		    },
			agent:agent
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
		console.log(count)
		if (count <= 3){
		setTimeout(function(){
		return testProxy(options, l, proxy, count)
	}, 500)
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

}, Math.random * l * 1000)
}
getProxies()

/*
var hosts = ""; // HTTP proxies go here, in the format host:port separated by a single space.

function FindProxyForURL(url, host)
{
    var hostsArray = hosts.split(" ");
    var randomIndex = Math.floor((Math.random() * hostsArray.length));
    return "PROXY " + hostsArray[randomIndex] + "; DIRECT"; // DIRECT makes the browser use no proxy if the chosen proxy doesn't work
}

*/

setInterval(function(){
	
	var text = 'var hosts="' 
	for (var p in finalProxies){
		text+= finalProxies[p].split('://')[1] + " "
	}
	text += '"\nfunction FindProxyForURL(url, host){'

    text += '\nvar hostsArray = hosts.split(" ");'
    text+= '\nvar randomIndex = Math.floor((Math.random() * hostsArray.length));'
    text+= '\nreturn "PROXY " + hostsArray[randomIndex] + ";" }' // DIRECT makes the browser use no proxy if the chosen proxy doesn't work


   		fs.writeFileSync('C:\\freeProxyRotator\\proxies.PAC',text,{encoding:'utf8',flag:'w'})

   	}, 15000)