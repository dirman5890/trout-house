import { defineField, defineType } from 'sanity';

// Image with required alt text and an optional caption.
export default defineType({
  name: 'unitPhoto',
  title: 'Photo',
  type: 'image',
  options: { hotspot: true },
  fields: [
    defineField({
      name: 'alt',
      title: 'Alt text',
      type: 'string',
      description: 'Describe the photo for screen readers and SEO.',
      validation: (Rule) =>
        Rule.required().error('Alt text is required for accessibility.'),
    }),
    defineField({
      name: 'caption',
      title: 'Caption (optional)',
      type: 'string',
    }),
  ],
});
