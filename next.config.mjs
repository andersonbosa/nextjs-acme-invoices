/** @type {import('next').NextConfig} */

const nextConfig = {
  experimental: {
    /* https://nextjs.org/docs/app/api-reference/next-config-js/ppr */
    ppr: 'incremental'
  }
}

export default nextConfig
