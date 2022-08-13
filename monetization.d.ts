import { MonetizationObject } from '@webmonetization/types';

declare global {
  interface Document {
    monetization?: MonetizationObject;
  }
}
