import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'cta',
  title: 'Call to action',
  type: 'object',
  fields: [
    defineField({
      name: 'label',
      title: 'Label',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'href',
      title: 'Link',
      type: 'string',
      description: 'Use a relative path like "/units" for internal links, or a full URL for external.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'external',
      title: 'Opens in new tab',
      type: 'boolean',
      initialValue: false,
    }),
  ],
});
