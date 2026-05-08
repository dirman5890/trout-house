import type { StructureResolver } from 'sanity/structure';

// Sidebar structure for Sanity Studio. Singletons are flat (no list view),
// while units appear as a sortable collection.
export const structure: StructureResolver = (S) =>
  S.list()
    .title('Trout House')
    .items([
      S.listItem()
        .title('Site settings')
        .child(S.document().schemaType('siteSettings').documentId('siteSettings')),
      S.divider(),
      S.listItem()
        .title('Homepage')
        .child(S.document().schemaType('homePage').documentId('homePage')),
      S.listItem()
        .title('Units page')
        .child(S.document().schemaType('unitsPage').documentId('unitsPage')),
      S.listItem()
        .title('Short stays page')
        .child(S.document().schemaType('shortStaysPage').documentId('shortStaysPage')),
      S.listItem()
        .title('Neighborhood page')
        .child(S.document().schemaType('neighborhoodPage').documentId('neighborhoodPage')),
      S.listItem()
        .title('Apply page')
        .child(S.document().schemaType('applyPage').documentId('applyPage')),
      S.divider(),
      S.documentTypeListItem('unit').title('Units'),
      S.documentTypeListItem('booking').title('Bookings'),
    ]);
