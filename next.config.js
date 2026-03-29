/** @type {import('next').NextConfig} */
module.exports = {
  turbopack: {},
};/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {},
  // ✅ Forces fresh chunk generation
  generateBuildId: async () => {
    return `build-${Date.now()}`;
  },
};

module.exports = nextConfig;