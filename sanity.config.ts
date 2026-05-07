'use client';

import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { schemaTypes } from './sanity/schemaTypes';
import { structure } from './sanity/structure';
import { apiVersion, dataset, projectId } from './sanity/env';

export default defineConfig({
  name: 'trout-house',
  title: 'Trout House',
  basePath: '/studio',
  projectId,
  dataset,
  schema: { types: schemaTypes },
  plugins: [
    structureTool({ structure }),
    // Vision is the GROQ playground — handy for debugging queries in dev.
    visionTool({ defaultApiVersion: apiVersion }),
  ],
});
