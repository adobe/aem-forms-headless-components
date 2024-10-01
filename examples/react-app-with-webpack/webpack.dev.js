const {merge} = require('webpack-merge');
const common = require('./webpack.common.js');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
    .BundleAnalyzerPlugin;
const path = require('path');
require('dotenv').config({ path: './.env' });

const {
  REACT_APP_AEM_HOST, REACT_APP_USE_PROXY,
  REACT_APP_AEM_AUTH_USER, REACT_APP_AEM_AUTH_PASS
} = process.env;


const getAEMBasicAuth = () => {
  const credentialsString = REACT_APP_AEM_AUTH_USER + ":" + REACT_APP_AEM_AUTH_PASS;
  return "Basic " + Buffer.from(credentialsString).toString("base64");
};

const aemProxyReq = (proxyReq) => {
  if (REACT_APP_USE_PROXY === "true") {
    const authValue = getAEMBasicAuth();
    proxyReq.setHeader("authorization", authValue);
  }
};

module.exports =
    merge(common, {
        mode: 'development',
        devtool: 'source-map',
        performance: {hints: 'warning'},
        devServer: {
            static: {
                directory: path.join(__dirname, 'dist'),
            },
            client: {
                overlay: false
            },
            open: true,
            hot: true,
            compress: true,
            port: 3000,
            proxy: {
                '/adobe': {
                    target: REACT_APP_AEM_HOST,
                    secure: false,
                    changeOrigin: true,
                    onProxyReq: aemProxyReq
                },
                '/content': {
                    target: REACT_APP_AEM_HOST,
                    secure: false,
                    changeOrigin: true,
                    onProxyReq: aemProxyReq
                }
            }
        },
        plugins: [
            new BundleAnalyzerPlugin({
                analyzerMode: 'static',
                generateStatsFile: true,
                openAnalyzer: false,
            })
        ],
    });
