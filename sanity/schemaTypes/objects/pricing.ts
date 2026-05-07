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
      name: 'monthlyWinter',
      title: 'M2M Winter (Oct–May)',
      type: 'number',
      fieldset: 'rates',
      validation: (Rule) => Rule.required().positive(),
    }),
    defineField({
      name: 'monthlySummer',
      title: 'M2M Summer (Jun–Sep)',
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
    defineField({
      name: 'utilitiesIncludedMonthlyWinter',
      title: 'M2M Winter',
      type: 'boolean',
      fieldset: 'utilities',
      initialValue: true,
    }),
    defineField({
      name: 'utilitiesIncludedMonthlySummer',
      title: 'M2M Summer',
      type: 'boolean',
      fieldset: 'utilities',
      initialValue: true,
    }),
  ],
});
