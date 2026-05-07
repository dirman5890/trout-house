import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'unitFeature',
  title: 'Feature',
  type: 'object',
  fields: [
    defineField({
      name: 'label',
      title: 'Feature',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: { title: 'label' },
  },
});
