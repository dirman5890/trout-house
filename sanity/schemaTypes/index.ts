import type { SchemaTypeDefinition } from 'sanity';

import siteSettings from './siteSettings';
import unit from './unit';
import homePage from './homePage';
import unitsPage from './unitsPage';
import shortStaysPage from './shortStaysPage';
import neighborhoodPage from './neighborhoodPage';
import applyPage from './applyPage';

import address from './objects/address';
import pricing from './objects/pricing';
import unitFeature from './objects/unitFeature';
import unitPhoto from './objects/unitPhoto';
import valueProp from './objects/valueProp';
import walkableItem from './objects/walkableItem';
import season from './objects/season';
import faqItem from './objects/faqItem';
import applyStep from './objects/applyStep';
import cta from './objects/cta';
import richText from './objects/richText';

export const schemaTypes: SchemaTypeDefinition[] = [
  // Documents
  siteSettings,
  unit,
  homePage,
  unitsPage,
  shortStaysPage,
  neighborhoodPage,
  applyPage,
  // Objects
  address,
  pricing,
  unitFeature,
  unitPhoto,
  valueProp,
  walkableItem,
  season,
  faqItem,
  applyStep,
  cta,
  richText,
];
