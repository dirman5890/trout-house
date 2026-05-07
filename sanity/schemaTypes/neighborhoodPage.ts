import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'neighborhoodPage',
  title: 'Neighborhood page',
  type: 'document',
  groups: [
    { name: 'hero', title: 'Hero', default: true },
    { name: 'walkable', title: 'Walkable' },
    { name: 'seasons', title: 'Seasons' },
  ],
  fields: [
    defineField({
      name: 'eyebrow',
      title: 'Eyebrow',
      type: 'string',
      group: 'hero',
      initialValue: 'The neighborhood',
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      group: 'hero',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
      group: 'hero',
    }),
    defineField({
      name: 'heroPhoto',
      title: 'Hero photo',
      type: 'unitPhoto',
      group: 'hero',
      description: 'Wide aerial / lake photo (21:9 looks best).',
    }),
    defineField({
      name: 'walkableEyebrow',
      title: 'Walkable eyebrow',
      type: 'string',
      group: 'walkable',
      initialValue: 'Walkable',
    }),
    defineField({
      name: 'walkableTitle',
      title: 'Walkable title',
      type: 'string',
      group: 'walkable',
    }),
    defineField({
      name: 'walkableItems',
      title: 'Walkable destinations',
      type: 'array',
      group: 'walkable',
      of: [{ type: 'walkableItem' }],
    }),
    defineField({
      name: 'seasonsEyebrow',
      title: 'Seasons eyebrow',
      type: 'string',
      group: 'seasons',
      initialValue: 'Seasons',
    }),
    defineField({
      name: 'seasonsTitle',
      title: 'Seasons title',
      type: 'string',
      group: 'seasons',
    }),
    defineField({
      name: 'seasons',
      title: 'Seasons',
      type: 'array',
      group: 'seasons',
      of: [{ type: 'season' }],
    }),
  ],
  preview: { prepare: () => ({ title: 'Neighborhood page' }) },
});
