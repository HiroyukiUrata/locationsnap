const webpack = require('webpack');

module.exports = {
  reactStrictMode: true,
  async headers() {
    return [
      {
        // matching all API routes
        source: "/(.*)",
        headers: [
          { key: "Access-Control-Allow-Origin", value: "*" },
          { key: "Access-Control-Allow-Headers", value: "authorization, content-type, x-client-info, apikey" },
        ]
      }
    ]
  },
  webpack: config => {
  config.plugins.push(
    new webpack.DefinePlugin({
    CESIUM_BASE_URL: JSON.stringify('cesium'),
    }),
  );
  return config;
  }
  
}

