# freeProxyRotator

## Use

1. npm i proxy-lists request-promise socks-proxy-agent
2. Change this text: /home/jarettrsdunn/testnet-inter-exchange-volume-sma-crosses-trader-on-bitmex-/ to your webserver root wWW directory (usually /var/www/html on Linux).
2. node proxies.js - this cannot be run as root. It also needs access to your webserver or a directory on it.
3. Wait a little while, until there's output from the node file into terminal.
4. DuckDuckGo search how to load a .PAC file into your favorite browser to rotate your proxies for you according to PAC rules.
5. Your PAC address is (ipOrDomainOrLocalhost)/proxies.PAC.
6. So long as the node app is running, your free proxies will update in realtime. It'll keep testing them to see which are working, and should (for the most part) work to secure your browsing via SOCKS4/SOCKS5.

## Check


This probably won't update all that often, but it's a good sample of what a PAC would look like:


http://jare.cloud/proxies/proxies.PAC


## Troubleshooting



1. sudo mkdir /var/www/html/proxies
2. sudo chmod 777 /var/www/html/proxies 
3. change the path at the bottom of the proxies.js to /var/www/html/proxies/proxies.PAC

