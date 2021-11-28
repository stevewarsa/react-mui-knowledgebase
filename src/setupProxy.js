const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = (app) => {
    app.use(
        createProxyMiddleware('/kb', {
            target: 'http://localhost:8080',
            changeOrigin: true,
            logLevel: "debug",
            headers: {
                Connection: "keep-alive"
            }
        })
    );
}