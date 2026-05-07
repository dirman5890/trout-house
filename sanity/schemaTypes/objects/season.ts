import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'season',
  title: 'Season',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Title (e.g. "Winter (Nov–Apr)")',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'text',
      rows: 4,
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'body' },
  },
});
