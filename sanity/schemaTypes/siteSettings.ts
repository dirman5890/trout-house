import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'siteSettings',
  title: 'Site settings',
  type: 'document',
  // Singleton: one document only, hidden from "create new" menu via structure.
  groups: [
    { name: 'identity', title: 'Identity' },
    { name: 'contact', title: 'Contact' },
    { name: 'links', title: 'External links' },
  ],
  fields: [
    defineField({
      name: 'name',
      title: 'Short name',
      type: 'string',
      group: 'identity',
      initialValue: 'Trout House',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'fullName',
      title: 'Full name',
      type: 'string',
      group: 'identity',
      initialValue: 'Trout House Kings Beach',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'tagline',
      title: 'Tagline',
      type: 'string',
      group: 'identity',
      initialValue: 'Furnished living on the North Shore',
    }),
    defineField({
      name: 'description',
      title: 'Description (used for SEO)',
      type: 'text',
      rows: 2,
      group: 'identity',
    }),
    defineField({
      name: 'address',
      title: 'Address',
      type: 'address',
      group: 'identity',
    }),
    defineField({
      name: 'contactEmail',
      title: 'Contact email',
      type: 'string',
      group: 'contact',
    }),
    defineField({
      name: 'contactPhone',
      title: 'Contact phone',
      type: 'string',
      group: 'contact',
    }),
    defineField({
      name: 'airbnbUrl',
      title: 'Airbnb listing URL',
      type: 'url',
      group: 'links',
      description: 'Used for the "Book Short Stay" button across the site.',
    }),
    defineField({
      name: 'applyUrlFallback',
      title: 'Default Avail application URL',
      type: 'url',
      group: 'links',
      description: 'Used on the /apply page. Per-unit URLs override this on unit pages.',
    }),
  ],
  preview: {
    prepare: () => ({ title: 'Site settings' }),
  },
});
