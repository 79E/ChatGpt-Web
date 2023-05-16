/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    swcMinify: true,
    transpilePackages: ['antd', '@ant-design/pro-components'],
    env: {
        APP_ENV: process.env.APP_ENV
    },
}

module.exports = nextConfig
