import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'walkableItem',
  title: 'Walkable destination',
  type: 'object',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'detail',
      title: 'Detail (e.g. "5 min walk")',
      type: 'string',
    }),
  ],
  preview: {
    select: { title: 'name', subtitle: 'detail' },
  },
});
