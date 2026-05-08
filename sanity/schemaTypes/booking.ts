import { defineField, defineType } from 'sanity';

// A single occupancy block on one unit. Could be a long-term lease, an
// Airbnb stay, or a deliberate blackout (renovation, owner use, etc).
// The website queries these and computes each unit's availability text
// — no manual "Available July 11" strings to keep in sync.

export default defineType({
  name: 'booking',
  title: 'Booking',
  type: 'document',
  fields: [
    defineField({
      name: 'unit',
      title: 'Unit',
      type: 'reference',
      to: [{ type: 'unit' }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'startDate',
      title: 'Start date',
      type: 'date',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'endDate',
      title: 'End date',
      type: 'date',
      description: 'The unit becomes available again the day after this date.',
      validation: (Rule) =>
        Rule.required().min(Rule.valueOfField('startDate')).error(
          'End date must be on or after start date.',
        ),
    }),
    defineField({
      name: 'type',
      title: 'Type',
      type: 'string',
      options: {
        list: [
          { title: 'Long-term lease', value: 'long-term' },
          { title: 'Short-term (Airbnb)', value: 'short-term' },
          { title: 'Blackout (owner / renovation)', value: 'blackout' },
        ],
        layout: 'radio',
      },
      initialValue: 'long-term',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'tenantName',
      title: 'Tenant / guest name',
      type: 'string',
      description: 'Internal reference only — never shown publicly.',
    }),
    defineField({
      name: 'notes',
      title: 'Notes',
      type: 'text',
      rows: 2,
      description: 'Internal reference only — never shown publicly.',
    }),
  ],
  orderings: [
    {
      title: 'Start date (earliest first)',
      name: 'startDateAsc',
      by: [{ field: 'startDate', direction: 'asc' }],
    },
  ],
  preview: {
    select: {
      unitName: 'unit.name',
      unitNumber: 'unit.unitNumber',
      tenant: 'tenantName',
      start: 'startDate',
      end: 'endDate',
      type: 'type',
    },
    prepare: ({ unitName, unitNumber, tenant, start, end, type }) => ({
      title: tenant
        ? `${unitName || `Unit ${unitNumber}`} — ${tenant}`
        : `${unitName || `Unit ${unitNumber}`}`,
      subtitle: `${start} → ${end} · ${type}`,
    }),
  },
});
