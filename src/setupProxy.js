const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/token",
    createProxyMiddleware({
      target: "https://nid.naver.com/oauth2.0/token",
      changeOrigin: true,
      secure: true,
    })
  );

  app.use(
    "/me",
    createProxyMiddleware({
      target: "https://openapi.naver.com/v1/nid/me",
      changeOrigin: true,
      secure: true,
    })
  );
};
