import {Client, Environment} from '@paypal/paypal-server-sdk';

const client = function () {
  const clientId = process.env.PAYPAL_CLIENT_ID!;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET!;

  return new Client({
    clientCredentialsAuthCredentials: {
      oAuthClientId: clientId,
      oAuthClientSecret: clientSecret,
    },
    environment:
      process.env.PAYPAL_LIVE === 'true'
        ? Environment.Production
        : Environment.Sandbox,
  });
};

export default client;
