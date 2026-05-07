import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'applyPage',
  title: 'Apply page',
  type: 'document',
  groups: [
    { name: 'hero', title: 'Hero', default: true },
    { name: 'steps', title: 'Steps' },
    { name: 'faq', title: 'FAQ' },
  ],
  fields: [
    defineField({
      name: 'eyebrow',
      title: 'Eyebrow',
      type: 'string',
      group: 'hero',
      initialValue: 'Apply',
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
      name: 'steps',
      title: 'Application steps',
      type: 'array',
      group: 'steps',
      of: [{ type: 'applyStep' }],
    }),
    defineField({
      name: 'faqEyebrow',
      title: 'FAQ eyebrow',
      type: 'string',
      group: 'faq',
      initialValue: 'Common questions',
    }),
    defineField({
      name: 'faqTitle',
      title: 'FAQ title',
      type: 'string',
      group: 'faq',
    }),
    defineField({
      name: 'faqs',
      title: 'FAQ items',
      type: 'array',
      group: 'faq',
      of: [{ type: 'faqItem' }],
    }),
  ],
  preview: { prepare: () => ({ title: 'Apply page' }) },
});
