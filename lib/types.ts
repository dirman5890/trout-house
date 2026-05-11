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

// Full rental application — mirrors the PDF "RENTAL APPLICATION" fields.
export type ApplicationPayload = {
  // About this unit
  unitNumber: string;
  moveInDate: string;
  leaseTerm: string;
  occupants: string;

  // Personal
  firstName: string;
  middleInitial?: string;
  lastName: string;
  dateOfBirth: string;
  driversLicense: string;
  phone: string;
  altPhone?: string;
  email: string;

  // Current address
  currentAddress: string;
  currentCityStateZip: string;
  currentMoveIn?: string;
  currentLandlordName?: string;
  currentLandlordPhone?: string;
  currentRent?: string;
  reasonForMoving?: string;

  // Previous address #1
  prev1Address?: string;
  prev1CityStateZip?: string;
  prev1MoveIn?: string;
  prev1MoveOut?: string;
  prev1LandlordName?: string;
  prev1LandlordPhone?: string;
  prev1Rent?: string;

  // Previous address #2
  prev2Address?: string;
  prev2CityStateZip?: string;
  prev2MoveIn?: string;
  prev2MoveOut?: string;
  prev2LandlordName?: string;
  prev2LandlordPhone?: string;
  prev2Rent?: string;

  // Employment
  employer: string;
  employerPhone?: string;
  grossWages: string;
  supervisor?: string;
  hireDate?: string;
  otherIncome?: string;

  // Questionnaire
  durationOfStay?: string;
  vehicleCount?: string;
  vehicleMake?: string;
  vehicleModel?: string;
  vehiclePlate?: string;
  pets?: string;
  petsBitten?: string;
  petsTrainedAttack?: string;
  petsDepositOk?: string;
  evictions?: string;
  brokenLeases?: string;
  felonies?: string;
  smokes?: string;
  checkingAccount?: string;
  moveInAmountReady?: string;
  rentLimitations?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  whyRentToYou?: string;

  // Additional / agreement
  additionalInfo?: string;
  agreed: string; // checkbox value (must be "yes")
};
