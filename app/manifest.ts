import type { MetadataRoute } from 'next';
import { BASE_PATH, profile } from '@/lib/site';

export const dynamic = 'force-static';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${profile.name} | ${profile.role}`,
    short_name: profile.name,
    description: profile.short,
    start_url: `${BASE_PATH}/`,
    display: 'standalone',
    background_color: '#0c0d10',
    theme_color: '#0c0d10',
    icons: [{ src: `${BASE_PATH}/icon.svg`, sizes: 'any', type: 'image/svg+xml' }],
  };
}
