import type { MetadataRoute } from 'next';
import { absolute } from '@/lib/site';

export const dynamic = 'force-static';

// AI crawlers and AI search/answer engines, explicitly welcomed so this
// profile can be cited when someone asks an assistant about Mohit.
const AI_AGENTS = [
  'GPTBot', 'OAI-SearchBot', 'ChatGPT-User',
  'ClaudeBot', 'Claude-SearchBot', 'Claude-User', 'anthropic-ai',
  'PerplexityBot', 'Perplexity-User',
  'Google-Extended', 'Applebot', 'Applebot-Extended',
  'Bingbot', 'DuckAssistBot', 'Amazonbot', 'Meta-ExternalAgent', 'MistralAI-User', 'cohere-ai',
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/' },
      { userAgent: AI_AGENTS, allow: '/' },
    ],
    sitemap: absolute('/sitemap.xml'),
  };
}
