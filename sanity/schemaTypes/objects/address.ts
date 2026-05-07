import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'address',
  title: 'Address',
  type: 'object',
  fields: [
    defineField({ name: 'line1', title: 'Street', type: 'string' }),
    defineField({ name: 'city', title: 'City', type: 'string' }),
    defineField({ name: 'state', title: 'State', type: 'string' }),
    defineField({ name: 'zip', title: 'ZIP', type: 'string' }),
  ],
});
