// Sanity env config. Values default to empty strings rather than throwing,
// so the Next.js build doesn't fail before the user has run `sanity init`.
// Pages handle empty Sanity responses gracefully — the only thing that breaks
// without a project ID is the embedded Studio at /studio.

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '';
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
export const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-10-01';

// Used by the seed script and any server-side write operation. Keep secret.
export const writeToken = process.env.SANITY_WRITE_TOKEN;

export const isConfigured = projectId.length > 0;
