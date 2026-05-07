import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'shortStaysPage',
  title: 'Short stays page',
  type: 'document',
  groups: [
    { name: 'hero', title: 'Hero', default: true },
    { name: 'body', title: 'Body' },
    { name: 'sidebar', title: 'Sidebar' },
  ],
  fields: [
    defineField({
      name: 'eyebrow',
      title: 'Eyebrow',
      type: 'string',
      group: 'hero',
      initialValue: 'Short stays',
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
      name: 'unit',
      title: 'Featured unit (used for the photo gallery)',
      type: 'reference',
      group: 'body',
      to: [{ type: 'unit' }],
      description: 'Pick the unit that\'s bookable on Airbnb (typically Bobcat / Unit 1).',
    }),
    defineField({
      name: 'bodyEyebrow',
      title: 'Body eyebrow',
      type: 'string',
      group: 'body',
      initialValue: 'Why guests pick this one',
    }),
    defineField({
      name: 'bodyTitle',
      title: 'Body title',
      type: 'string',
      group: 'body',
    }),
    defineField({
      name: 'bodyContent',
      title: 'Body content',
      type: 'richText',
      group: 'body',
    }),
    defineField({
      name: 'amenities',
      title: 'Amenities',
      type: 'array',
      group: 'sidebar',
      of: [{ type: 'string' }],
      options: { layout: 'tags' },
    }),
    defineField({
      name: 'detailImage',
      title: 'Sidebar detail image',
      type: 'unitPhoto',
      group: 'sidebar',
    }),
  ],
  preview: { prepare: () => ({ title: 'Short stays page' }) },
});
