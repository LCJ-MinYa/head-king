const AnyProxy = require('anyproxy');
const headKingRule = require('./rule/head_king_rule');

const options = {
	port: 8001,
	rule: headKingRule,
	webInterface: {
		enable: true,
		webPort: 8002,
		wsPort: 8003,
	},
	throttle: 10000,
	forceProxyHttps: true,
	silent: false,
	wsIntercept: true
};
const proxyServer = new AnyProxy.ProxyServer(options);

proxyServer.on('ready', () => {
	console.log('ready');
});
proxyServer.on('error', (e) => { /* */ });
proxyServer.start();

//when finished
//proxyServer.close();