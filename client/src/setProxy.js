const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/api/v1",
    createProxyMiddleware({
      target: "http://i9c107.p.ssafy.io:8080",
      changeOrigin: true,
    })
  );

  // 웹 소켓 프록시 설정
  app.use(
    "/ws/chat", // 웹 소켓 경로
    createProxyMiddleware({
      target: "http://i9c107.p.ssafy.io:8080",
      ws: true, // 웹 소켓 프록시를 위한 옵션
      changeOrigin: true,
    })
  );
};