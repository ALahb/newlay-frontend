const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  // Add CSP headers for iframe integration
  app.use((req, res, next) => {
    // Set CSP headers to allow iframe embedding
    res.setHeader('Content-Security-Policy', "frame-ancestors 'self' http://localhost:* https://localhost:* https://*.yourdomain.com;");
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    next();
  });
};
