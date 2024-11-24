import { environment as common } from './environment.common';

export const environment = {
  ...common, // Spread the common environment properties
  production: true
};
