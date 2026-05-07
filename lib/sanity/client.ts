import { createClient } from 'next-sanity';
import { apiVersion, dataset, isConfigured, projectId } from '@/sanity/env';

// Read-only client used by all server components for fetching content.
// `useCdn: true` enables Sanity's edge cache for fast public reads.
//
// When Sanity isn't configured (NEXT_PUBLIC_SANITY_PROJECT_ID is empty),
// we still create a client with a placeholder so module-load doesn't crash —
// `sanityFetch` short-circuits to null in that case.
export const sanityClient = createClient({
  projectId: projectId || 'placeholder',
  dataset,
  apiVersion,
  useCdn: true,
  perspective: 'published',
});

let warned = false;

// Wrapper that combines Next.js revalidation with Sanity's tag-based cache.
// Returns null on any error (including Sanity not being configured) so pages
// can render fallback states without try/catch boilerplate everywhere.
export async function sanityFetch<T>({
  query,
  params = {},
  tags = [],
  revalidate = 60,
}: {
  query: string;
  params?: Record<string, unknown>;
  tags?: string[];
  revalidate?: number | false;
}): Promise<T | null> {
  if (!isConfigured) {
    if (!warned) {
      console.warn(
        '[sanity] NEXT_PUBLIC_SANITY_PROJECT_ID is not set — pages will render fallback content. Run `npm run sanity:seed` after creating a project.',
      );
      warned = true;
    }
    return null;
  }
  try {
    return await sanityClient.fetch<T>(query, params, {
      next: {
        revalidate: tags.length ? false : revalidate,
        tags,
      },
    });
  } catch (err) {
    console.error('[sanity] fetch failed:', err);
    return null;
  }
}
