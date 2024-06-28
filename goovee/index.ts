import {GraphQLSchema} from 'graphql';

import {GooveeClient, createClient, createSchema} from './.generated/client';

let client: GooveeClient;
let schema: GraphQLSchema;

export async function getClient() {
  if (client === undefined) {
    client = createClient();
    await client.$connect();
    await client.$sync();
  }
  return client;
}

export function getSchema() {
  if (schema === undefined) {
    schema = createSchema();
  }
  return schema;
}
