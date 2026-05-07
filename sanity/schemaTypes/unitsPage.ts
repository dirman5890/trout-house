import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'unitsPage',
  title: 'Units page',
  type: 'document',
  fields: [
    defineField({
      name: 'eyebrow',
      title: 'Eyebrow',
      type: 'string',
      initialValue: 'The building',
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      initialValue: 'Eight units. Furnished, walkable, available on your terms.',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
    }),
  ],
  preview: { prepare: () => ({ title: 'Units page' }) },
});
