// Form payload types. Content/data types live in lib/sanity/types.ts.

export type ContactFormPayload = {
  name: string;
  email: string;
  phone?: string;
  unitNumber?: string;
  moveInDate?: string;
  leaseTerm?: string;
  message?: string;
};

export type SubscribePayload = {
  email: string;
  zip?: string;
};
