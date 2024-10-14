// *******************************************************************************
//  * Copyright 2024 Adobe
//  *
//  * Licensed under the Apache License, Version 2.0 (the “License”);
//  * you may not use this file except in compliance with the License.
//  * You may obtain a copy of the License at
//  *
//  *     http://www.apache.org/licenses/LICENSE-2.0
//  *
//  * Unless required by applicable law or agreed to in writing, software
//  * distributed under the License is distributed on an “AS IS” BASIS,
//  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//  * See the License for the specific language governing permissions and
//  * limitations under the License.
//  ******************************************************************************

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
          proxyReq.setHeader("authorization", getAEMBasicAuth());
        }
      },
    })
  );
};
