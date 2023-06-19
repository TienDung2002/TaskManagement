const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/datalist',
    createProxyMiddleware({
      target: 'http://localhost:3001', // Replace with your Node.js server address
      changeOrigin: true,
    })
  );
  app.use(
    '/createTask',
    createProxyMiddleware({
      target: 'http://localhost:3001', // Replace with your Node.js server address
      changeOrigin: true,
    })
  );
  app.use(
    '/updateTask',
    createProxyMiddleware({
      target: 'http://localhost:3001', // Replace with your Node.js server address
      changeOrigin: true,
    })
  );
  app.use(
    '/deleteTask',
    createProxyMiddleware({
      target: 'http://localhost:3001', // Replace with your Node.js server address
      changeOrigin: true,
    })
  );
};
