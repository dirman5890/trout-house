import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'pricing',
  title: 'Lease pricing',
  type: 'object',
  fieldsets: [
    { name: 'rates', title: 'Monthly rates ($)', options: { columns: 2 } },
    { name: 'utilities', title: 'Utilities included?', options: { columns: 2, collapsible: true, collapsed: false } },
  ],
  fields: [
    defineField({
      name: 'twelveMonth',
      title: '12-month',
      type: 'number',
      fieldset: 'rates',
      validation: (Rule) => Rule.required().positive(),
    }),
    defineField({
      name: 'sixMonth',
      title: '6-month',
      type: 'number',
      fieldset: 'rates',
      validation: (Rule) => Rule.required().positive(),
    }),
    defineField({
      name: 'utilitiesIncludedTwelveMonth',
      title: '12-month',
      type: 'boolean',
      fieldset: 'utilities',
      initialValue: false,
    }),
    defineField({
      name: 'utilitiesIncludedSixMonth',
      title: '6-month',
      type: 'boolean',
      fieldset: 'utilities',
      initialValue: true,
    }),
  ],
});
