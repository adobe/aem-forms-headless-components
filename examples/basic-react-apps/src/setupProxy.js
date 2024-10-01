const { createProxyMiddleware } = require("http-proxy-middleware");
require('dotenv').config({ path: '../.env' });

const {
  REACT_APP_AEM_HOST, REACT_APP_USE_PROXY,
  REACT_APP_AEM_AUTH_USER, REACT_APP_AEM_AUTH_PASS,
  REACT_APP_AEM_AUTH_TOKEN
} = process.env;


const getAEMBasicAuth = () => {
  if(REACT_APP_AEM_AUTH_TOKEN){
    return REACT_APP_AEM_AUTH_TOKEN;
  }
  const credentialsString =
    REACT_APP_AEM_AUTH_USER + ":" + REACT_APP_AEM_AUTH_PASS;
  return "Basic " + Buffer.from(credentialsString).toString("base64");
};

module.exports = function (app) {
  app.use(
    "/content",
    createProxyMiddleware({
      target: `${REACT_APP_AEM_HOST}`,
      secure: false,
      changeOrigin: true,
      onProxyReq: (proxyReq) => {
        if (REACT_APP_USE_PROXY === "true") {
          proxyReq.setHeader("authorization", getAEMBasicAuth());
        }
      },
    })
  );
  app.use(
    "/adobe",
    createProxyMiddleware({
      target: `${REACT_APP_AEM_HOST}`,
      secure: false,
      changeOrigin: true,
      onProxyReq: (proxyReq) => {
        if (REACT_APP_USE_PROXY === "true") {
          const authValue = getAEMBasicAuth();
          proxyReq.setHeader("authorization", authValue);
        }
      },
    })
  );
};
