const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

module.exports = withBundleAnalyzer({
  assetPrefix: process.env.ASSET_PREFIX,
  poweredByHeader: false,
  reactStrictMode: true,
})
