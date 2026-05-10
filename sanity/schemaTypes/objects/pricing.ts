import { defineField, defineType } from 'sanity';

// Both lease terms have the same utility policy: water + trash included,
// tenant pays electric + internet. So we only store the monthly rate —
// no per-term utility toggles.

export default defineType({
  name: 'pricing',
  title: 'Lease pricing',
  type: 'object',
  fields: [
    defineField({
      name: 'twelveMonth',
      title: '12-month rate ($)',
      type: 'number',
      validation: (Rule) => Rule.required().positive(),
    }),
    defineField({
      name: 'sixMonth',
      title: '6-month rate ($)',
      type: 'number',
      validation: (Rule) => Rule.required().positive(),
    }),
  ],
});
