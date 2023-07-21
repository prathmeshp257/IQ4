const proxy = require("http-proxy-middleware");

module.exports = function (app) {
	app.use(
		"/api",
		proxy.createProxyMiddleware({
			target: "http://locahost:5000",
			changeOrigin: true
		})
	);
};
