/** @type {import('next').NextConfig} */
// const nextConfig = {
//   experimental : {esmExternals: 'loose'}
// };

// export default nextConfig;


// import { createProxyMiddleware } from 'next-http-proxy-middleware';

const NEXT_PUBLIC_AEM_HOST = process.env.NEXT_PUBLIC_AEM_HOST;
const NEXT_PUBLIC_USE_PROXY = process.env.NEXT_PUBLIC_USE_PROXY;
const NEXT_PUBLIC_AEM_AUTH_USER = process.env.NEXT_PUBLIC_AEM_AUTH_USER;
const NEXT_PUBLIC_AEM_AUTH_PASS = process.env.NEXT_PUBLIC_AEM_AUTH_PASS;

const getAEMBasicAuth = () => {
  const credentialsString =
    NEXT_PUBLIC_AEM_AUTH_USER + ':' + NEXT_PUBLIC_AEM_AUTH_PASS;
  return 'Basic ' + Buffer.from(credentialsString).toString('base64');
};

const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/content/:path*',
        destination: `${NEXT_PUBLIC_AEM_HOST}/content/:path*`,
      },
      {
        source: '/adobe/:path*',
        destination: `${NEXT_PUBLIC_AEM_HOST}/adobe/:path*`,
      },
    ];
  },
  async headers() {
    return [
      {
        source: '/content/:path*',
        headers: NEXT_PUBLIC_USE_PROXY === 'true'
          ? [{ key: 'Authorization', value: getAEMBasicAuth() }]
          : [],
      },
      {
        source: '/adobe/:path*',
        headers: NEXT_PUBLIC_USE_PROXY === 'true'
          ? [{ key: 'Authorization', value: getAEMBasicAuth() }]
          : [],
      },
    ];
  },
  experimental: { esmExternals: 'loose' },
};
export default nextConfig;
