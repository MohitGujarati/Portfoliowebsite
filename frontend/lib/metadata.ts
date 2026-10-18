import type { Metadata } from 'next';
import { absolute } from './site';

/** Title, description and canonical URL for a page; the layout supplies the rest. */
export function pageMetadata(path: string, title: string, description: string): Metadata {
  return { title, description, alternates: { canonical: absolute(path) } };
}
