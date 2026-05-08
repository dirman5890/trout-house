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

export type ApplicationPayload = {
  // Personal
  name: string;
  email: string;
  phone: string;

  // Current residence
  currentAddress?: string;
  currentCity?: string;

  // Employment
  employer: string;
  jobTitle?: string;
  monthlyIncome: string;

  // Tenancy
  unitNumber: string;
  leaseTerm: string;
  moveInDate: string;
  pets: string;
  petsDescription?: string;

  // References
  previousLandlord?: string;
  previousLandlordPhone?: string;
  professionalReference?: string;
  professionalReferencePhone?: string;

  // Notes
  message?: string;
};
