import {experimental_taintUniqueValue} from 'react';
import {genericOAuth, keycloak as config} from 'better-auth/plugins';

const clientSecret = process.env.KEYCLOAK_SECRET as string;

if (process.env.SHOW_KEYCLOAK_OAUTH === 'true') {
  experimental_taintUniqueValue(
    'Keycloak Client Secret is an authentication secret. Do not pass to Client Components.',
    process,
    clientSecret,
  );
}

const keycloak =
  process.env.SHOW_KEYCLOAK_OAUTH === 'true'
    ? genericOAuth({
        config: [
          config({
            clientId: process.env.KEYCLOAK_ID as string,
            clientSecret,
            issuer: process.env.KEYCLOAK_ISSUER as string,
          }),
        ],
      })
    : null;

export default keycloak;
