// Replace Avail-specific apply page content with the new in-house process.

import { createClient } from '@sanity/client';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-10-01',
  token: process.env.SANITY_WRITE_TOKEN!,
  useCdn: false,
});

(async () => {
  await client
    .patch('applyPage')
    .set({
      title: 'Three steps to a key in your hand.',
      description:
        'No application fee, no third-party redirects. Submit through the form below — most applications are reviewed within 48 hours.',
      steps: [
        {
          _key: 's1',
          _type: 'applyStep',
          title: 'Choose your unit and lease term',
          body: 'Browse the units page, pick what fits your stay, and note the lease term — twelve-month or six-month.',
        },
        {
          _key: 's2',
          _type: 'applyStep',
          title: 'Submit the application',
          body: "Fill out the form on this page — takes about 5 minutes. No application fee, and your information goes directly to us, not a third-party screening service.",
        },
        {
          _key: 's3',
          _type: 'applyStep',
          title: 'We review within 48 hours',
          body: "We review every application personally and reach out by email with next steps — questions, a viewing, or a lease offer.",
        },
        {
          _key: 's4',
          _type: 'applyStep',
          title: 'Sign your lease and move in',
          body: "Lease signing is digital. Once it's signed and the deposit is paid, you get keys and the door code. Move in on your start date.",
        },
      ],
      faqs: [
        {
          _key: 'fee',
          _type: 'faqItem',
          q: 'Is there an application fee?',
          a: "No. Submitting an application is free. If we'd like to move forward after reviewing your application, we may run a background check at that stage and will discuss any associated cost with you first.",
        },
        {
          _key: 'utilities',
          _type: 'faqItem',
          q: 'Are utilities included?',
          a: 'Utilities are included on the 6-month lease. On the 12-month lease, the tenant pays utilities directly — most tenants find this saves money over a full year.',
        },
        {
          _key: 'pets',
          _type: 'faqItem',
          q: 'Are pets allowed?',
          a: 'We consider pets case by case. Mention your pet on the application and we will let you know — there is typically a one-time pet deposit and a small monthly pet rent.',
        },
        {
          _key: 'parking',
          _type: 'faqItem',
          q: 'How does parking work?',
          a: 'Each unit comes with one reserved off-street parking spot. Additional vehicles can use street parking subject to local rules.',
        },
        {
          _key: 'deposit',
          _type: 'faqItem',
          q: 'What is the security deposit?',
          a: "One month's rent, refundable at move-out subject to standard California security deposit law.",
        },
        {
          _key: 'sublet',
          _type: 'faqItem',
          q: 'Can I sublet or rent out the unit on Airbnb?',
          a: 'No. Long-term leases are for residential use only. Subletting and short-term rental are not permitted.',
        },
        {
          _key: 'viewings',
          _type: 'faqItem',
          q: 'Do you offer viewings?',
          a: 'Yes. Once you submit an application, or if you have specific questions before applying, we will schedule a 15-minute walkthrough.',
        },
        {
          _key: 'turnaround',
          _type: 'faqItem',
          q: 'How long does the process take?',
          a: 'From application to move-in is typically under a week. We respond to applications within 48 hours and lease signing happens digitally once we have agreement on terms.',
        },
      ],
    })
    .commit();

  console.log('✓ Apply page content updated (no more Avail / $55 fee mentions).');
})();
