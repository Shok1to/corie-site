/** @type {import('next').NextConfig} */
const nextConfig = {
  // The chat route reads the page at runtime to build the assistant's
  // knowledge, so the file has to ship with that serverless function.
  outputFileTracingIncludes: {
    '/api/chat': ['./site/index.html'],
  },
};

export default nextConfig;
