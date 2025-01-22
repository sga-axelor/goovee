# Customer Portal

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

One of the project's dependencies is deployed on Nexus because it depends on a commercial license. The enterprise registry has been added to `.npmrc` file but this registry requires authentication. Here is what to do to login into this registry:

1. Evaluate your Nexus token replacing username and password with their values:

```bash
echo -n "username:password" | base64
```

2. Add the computed value under the name _NEXUS_TOKEN_ to your `.bashrc` at your **home** with the following line:

```bash
export NEXUS_TOKEN= #printed value
```

3. Check if the value is correctly saved by running the following command:

```bash
echo $NEXUS_TOKEN
```

Once this is done, you can install the dependencies of the project and start working.

Some important commands:

- Install the dependencies : `pnpm i`
- Build the project : `pnpm build`
- Start the app : `pnpm start`
- Run development server : `pnpm dev`

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

# ORM

The application make use of `@goovee/orm` orm for data access. You can set the
database url in `.env` file. For e.g

```
DATABASE_URL=postgres://<user>:<password>@<host>:<port>/<db-name>
```

## Generating Data access client

For generating client, you need to first describe the schema in `axelor/schema` directory. Once done, you can then do `pnpm generate` to generate the orm client.
You can then use the client to access the data. For e.g

```
const partners = await client.partner.find()
```
