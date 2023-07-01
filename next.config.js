/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack(config){
    config.module.rules.push({
      test: /\.svg$/,
      use: [{
        loader: "@svgr/webpack",
        options: {
          titleProp: true
        }
      }]
    })

    return config
  }
}

export default nextConfig
