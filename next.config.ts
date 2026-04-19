/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'xlvtoslopxmjuqmznxjd.supabase.co',
        port: '',
        pathname: '/**', // Permet qualsevol ruta dins d'aquest domini de Supabase 
      },
    ],
  },
};

export default nextConfig;