/**
 * @doc https://umijs.org/docs/guides/proxy
 */
export default {
  // Môi trường dev: chuyển tiếp /api/v1 sang backend Spring Boot (localhost:9090)
  dev: {
    '/api/v1/': {
      target: 'https://decamath-api.duckdns.org',
      changeOrigin: true,
    },
  },
};
