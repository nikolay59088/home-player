
const ContentSecurityPolicy = `
  frame-ancestors https://*.yandex.ru
`

/** @type {import('next').NextConfig} */
const nextConfig = {

  async headers(){
    return [
      {
        source: '/auth',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: ContentSecurityPolicy.replace(/\s{2,}/g, ' ').trim()
          }
        ]
      }
    ]
  },

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
