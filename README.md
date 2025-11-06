# Your Next Store

A Next.js boilerplate for building modern, high-performance e-commerce applications with Your Next Store (YNS) and the Commerce Kit SDK. Simple, quick, powerful, and optimized for LLM ingest.

<div align="center">
<table>
<tr>
<td>
	<a href="https://yournextstore.com/discord"><img src="https://img.shields.io/discord/1206629600483082341?style=for-the-badge&logo=discord&logoColor=white&labelColor=%235865F2&color=%23555" alt="Join Discord" /></a>
</td>
<td>
	<a href="https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fyournextstore%2Fyournextstore&env=ENABLE_EXPERIMENTAL_COREPACK,YNS_API_TENANT,YNS_API_TOKEN&envDescription=Read%20more%20about%20required%20env%20variables%20in%20YNS&envLink=https%3A%2F%2Fgithub.com%2Fyournextstore%2Fyournextstore%2Ftree%2Fupcoming%3Ftab%3Dreadme-ov-file%23add-environmental-variables&project-name=yournextstore&repository-name=yournextstore&demo-title=Your%20Next%20Store&demo-description=A%20Next.js%20boilerplate%20for%20building%20your%20online%20store%20instantly%3A%20simple%2C%20quick%2C%20powerful.&demo-url=https%3A%2F%2Fdemo.yournextstore.com%2F&demo-image=https%3A%2F%2Fyournextstore.com%2Fdemo.png"><img src="https://vercel.com/button" alt="Deploy with Vercel" /></a>
</td>
<td>
<a href="https://www.producthunt.com/posts/your-next-store?utm_source=badge-featured&utm_medium=badge&utm_souce=badge-your-next-store">
	<picture>
		<source
			media="(prefers-color-scheme: dark)"
			srcSet="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=1009314&theme=dark"
		/>
		<img
			src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=1009314&theme=light"
			height="36"
			alt="Your Next Store ⋅ Online commerce should be fast and modern | Product Hunt"
		/>
	</picture>
</a>
</td>
</tr>
</table>

👉 [demo.yournextstore.com](https://demo.yournextstore.com/) 👈

</div>

## Tech Stack

- **Next.js 16** – App Router, React Server Components, React Compiler
- **Bun** – Fast JavaScript runtime and package manager
- **Commerce Kit SDK** – Headless commerce API integration
- **Tailwind CSS v4** – Modern utility-first styling
- **Shadcn UI** – Accessible component library with Radix UI primitives
- **Biome** – Lightning-fast linter and formatter
- **TypeScript** – Type-safe development

## Prerequisites

### Node.js 20+

We officially support the current LTS version – 20 at the time of writing. YNS should work on versions 18, 20, and 22. If you're using one of those versions and encounter a problem, please report it!

#### Installing Node.js

Follow the instructions for your operating system found here: [nodejs.org/en/download](https://nodejs.org/en/download)

### bun 1.0+

We officially support bun version 1.0+, but we will do our best to keep it compatible with npm and yarn.

#### Installing bun

The easiest way to install bun is via their installation script:

```bash
curl -fsSL https://bun.sh/install | bash
```

Alternatively, follow the instructions for your operating system found here: [bun.sh/docs/installation](https://bun.sh/docs/installation)

## Create YNS account

To use Your Next Store, you'll need to create an account at [yns.app/admin](https://yns.app/admin).

After creating your account, you'll be able to create a new store (tenant) and get your API token.

The token can be found in the API section in the sidebar.

## Add Environment Variables

For YNS to work, you'll need to define a few environmental variables. For local development and testing, you may create an empty `.env` file and copy the contents of `.env.example` into it.

To set env variables in production, you'll need to consult the documentation of your chosen hosting provider.

### Required Environment Variables

- `ENABLE_EXPERIMENTAL_COREPACK` – Vercel only: Set to `1` to enable Corepack
- `YNS_API_TENANT` – Your tenant address, for example `https://yourtenant.yns.app`
- `YNS_API_TOKEN` – API token generated in the admin panel.
- `NEXT_PUBLIC_ROOT_URL` – The address of your store without the trailing slash, i.e., `https://demo.yournextstore.com`. When building for the first time, you should set it to any valid URL, i.e. `http://localhost:3000`.

## Run the store

After following the above steps, run `bun install` to install the required dependencies, and then run `bun dev` to start the development server on your machine. Your Next Store will be available at [localhost:3000](http://localhost:3000)


## Next steps

Refer to the documentation found at [yns.app/admin/api/endpoints](https://yns.app/admin/api/endpoints) for more information on how to fetch products or create carts in your store.
