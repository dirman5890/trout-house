import { defineArrayMember, defineType } from 'sanity';

// Lightweight portable-text type for body copy. Allows paragraphs, basic
// formatting, links, and bullet lists — no headings (those come from the
// surrounding section), no images, no embeds.
export default defineType({
  name: 'richText',
  title: 'Rich text',
  type: 'array',
  of: [
    defineArrayMember({
      type: 'block',
      styles: [{ title: 'Paragraph', value: 'normal' }],
      lists: [{ title: 'Bullet', value: 'bullet' }],
      marks: {
        decorators: [
          { title: 'Bold', value: 'strong' },
          { title: 'Italic', value: 'em' },
        ],
        annotations: [
          {
            name: 'link',
            type: 'object',
            title: 'Link',
            fields: [
              {
                name: 'href',
                type: 'string',
                title: 'URL or path',
                validation: (Rule) => Rule.required(),
              },
              {
                name: 'external',
                type: 'boolean',
                title: 'Opens in new tab',
                initialValue: false,
              },
            ],
          },
        ],
      },
    }),
  ],
});
