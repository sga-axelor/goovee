# Customer Portal

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

# ORM

The application make use of `@axelor/cms-core` orm for data access. You can set the
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
