# OP_RETURN File Upload Example

An example of OP_RETURN in action using the BSV SDK. 

![Project Image](https://github.com/DollaHane/bsv-op_return-example/blob/main/components/Assets/Thumbnail.png)

## Features

- Next.js 15 App Directory
- BSV Blockchain SDK
- Shadcn Components
- Tailwind CSS
- TanStack Query
- Icons from [Lucide](https://lucide.dev)
- Dark mode with `next-themes`
- Tailwind CSS class sorting, merging and linting.


## Getting started

Download the repository to a directory of your choice and run:

```bash
  npm install
```

Create a private key using the code provided in './server/createKey.ts'. This should output the following:
 - A public key / address (Main Net).
 - A .wif file in the root directory containing the private key.

```bash
 address: '1E7ZM72xxxxxxxxxxxxxxxxxxxxx'
```

You will now need to fund the output address in order to send transactions over the network
For additional info see the BSV SDK Documentation link below.

Copy these variables into a .env file:

```bash
PRIVATE_KEY="<bsv-pvt-key>"
PUBLIC_KEY="bsv-pub-key"

UPSTASH_REDIS_REST_URL='https://<url>'
UPSTASH_REDIS_REST_TOKEN='<token>'
```

Start the dev server:

```bash
  npm run dev
```

## Documentation Links

- [BSV SDK Docs](https://docs.bsvblockchain.org/intro/quick-start): BSV SDK Docs.
- [Bitcoin SV Repo](https://github.com/bitcoin-sv): Bitcoin SV Repo
- [Upstash Rate Limiting](https://upstash.com/blog/nextjs-ratelimiting): Redis rate limiting.
- [Shadcn](https://ui.shadcn.com): UI Components

## Acknowledgements

- Shadcn's [NEXT Template](https://github.com/shadcn/next-template) which this repository was forked from

## License

[MIT](https://choosealicense.com/licenses/mit/)