import type { MetadataRoute } from 'next';
import { absolute, papers, profile, projects } from '@/lib/site';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: absolute('/'), lastModified: now, changeFrequency: 'monthly', priority: 1 },
    ...['about', 'experience', 'research'].map((path) => ({ url: absolute(`/${path}`), lastModified: now, changeFrequency: 'monthly' as const, priority: 0.9 })),
    ...projects.map((p) => ({ url: absolute(`/projects/${p.slug}`), lastModified: now, changeFrequency: 'monthly' as const, priority: 0.8 })),
    { url: absolute('/profile.json'), lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: absolute(profile.resume), lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    ...papers.map((p) => ({ url: absolute(p.file), changeFrequency: 'yearly' as const, priority: 0.6 })),
  ];
}
