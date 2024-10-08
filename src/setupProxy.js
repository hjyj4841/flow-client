const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/oauth2.0/token",
    createProxyMiddleware({
      target: "https://nid.naver.com/oauth2.0/token",
      changeOrigin: true,
    })
  );

  app.use(
    "/v1/nid/me",
    createProxyMiddleware({
      target: "https://openapi.naver.com/v1/nid/me",
      changeOrigin: true,
    })
  );
};
