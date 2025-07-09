# Your Next Store

<div align="center">
<table>
<tr>
<td>
	<a href="https://yournextstore.com/discord"><img src="https://img.shields.io/discord/1206629600483082341?style=for-the-badge&logo=discord&logoColor=white&labelColor=%235865F2&color=%23555" alt="Join Discord" /></a>
</td>
<td>
	<a href="https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fyournextstore%2Fyournextstore&env=ENABLE_EXPERIMENTAL_COREPACK,NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,STRIPE_SECRET_KEY,STRIPE_CURRENCY&envDescription=Read%20more%20about%20required%20env%20variables%20in%20YNS&envLink=https%3A%2F%2Fgithub.com%2Fyournextstore%2Fyournextstore%2Ftree%2Fupcoming%3Ftab%3Dreadme-ov-file%23add-environmental-variables&project-name=yournextstore&repository-name=yournextstore&demo-title=Your%20Next%20Store&demo-description=A%20Next.js%20boilerplate%20for%20building%20your%20online%20store%20instantly%3A%20simple%2C%20quick%2C%20powerful.&demo-url=https%3A%2F%2Fdemo.yournextstore.com%2F&demo-image=https%3A%2F%2Fyournextstore.com%2Fdemo.png"><img src="https://vercel.com/button" alt="Deploy with Vercel" /></a>
</td>
<td>
<a href="https://www.producthunt.com/posts/your-next-store?utm_source=badge-featured&utm_medium=badge&utm_souce=badge-your&#0045;next&#0045;store">
	<picture>
		<source
			media="(prefers-color-scheme: dark)"
			srcSet="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=459751&theme=dark"
		/>
		<img
			src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=459751&theme=light"
			height="36"
			alt="Your&#0032;Next&#0032;Store - E&#0045;Commerce&#0032;with&#0032;Stripe&#0032;as&#0032;the&#0032;backend | Product Hunt"
		/>
	</picture>
</a>
</td>
</tr>
</table>

👉 [demo.yournextstore.com](https://demo.yournextstore.com/) 👈

</div>

## Demo

https://github.com/user-attachments/assets/64197310-29bd-4dd3-a736-1494340e20e8


## Quick setup on Vercel:
1. Click here to deploy this repo on [Vercel](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fyournextstore%2Fyournextstore&env=ENABLE_EXPERIMENTAL_COREPACK,NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,STRIPE_SECRET_KEY,STRIPE_CURRENCY&envDescription=Read%20more%20about%20required%20env%20variables%20in%20YNS&envLink=https%3A%2F%2Fgithub.com%2Fyournextstore%2Fyournextstore%2Ftree%2Fupcoming%3Ftab%3Dreadme-ov-file%23add-environmental-variables&project-name=yournextstore&repository-name=yournextstore&demo-title=Your%20Next%20Store&demo-description=A%20Next.js%20boilerplate%20for%20building%20your%20online%20store%20instantly%3A%20simple%2C%20quick%2C%20powerful.&demo-url=https%3A%2F%2Fdemo.yournextstore.com%2F&demo-image=https%3A%2F%2Fyournextstore.com%2Fdemo.png)
2. Create new account on [Stripe](https://dashboard.stripe.com/register)

### Stripe: 
- Add at least one product in stripe with this two metadata
	- slug = "your-product-url-name" example hiking-t-shirt
	- category = "apparel"
- Get two api keys from your stripe developer [dashboard](https://dashboard.stripe.com/apikeys) 
	- NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
	- STRIPE_SECRET_KEY

### Vercel: 
- Add those informations as **Environment Variables** in your project settings 
	- ENABLE_EXPERIMENTAL_COREPACK = "1"
	- STRIPE_CURRENCY = "usd" or any other in iso format
	- NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY = from stripe
	- STRIPE_SECRET_KEY = from stripe

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

## Create Stripe account

YNS is tightly integrated with [Stripe](https://stripe.com), so you need a Stripe account to use Your Next Store. Follow the instructions from Stripe to [create an account](https://dashboard.stripe.com/register).

It's important to remember that Stripe works in two different modes: **Test Mode** and **Production Mode**. For local development and testing purposes, you should use the **Test Mode**. This way, Stripe will never charge real money, and you can use special test credentials such as credit card numbers and BLIK numbers to complete payments. For more detailed information, please refer to the Stripe documentation at [docs.stripe.com/testing](https://docs.stripe.com/testing).

Once you're ready to sell your products to real customers, you must switch **Test Mode** to **Production Mode** in Stripe and generate new credentials.

> [!TIP]
> This step will require additional verification from Stripe, so we suggest you start the process immediately.

## Add Environment Variables

For YNS to work, you'll need to define a few environmental variables. For local development and testing, you may create an empty `.env` file and copy the contents of `.env.example` into it.

To set env variables in production, you'll need to consult the documentation of your chosen hosting provider.

### Required Environment Variables

- `ENABLE_EXPERIMENTAL_COREPACK` – Vercel only: Set to `1` to enable Corepack
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` – Publishable key from Stripe.
- `STRIPE_SECRET_KEY` – Secret key from Stripe.
- `STRIPE_CURRENCY` – This is used to determine your store's currency. Currently, only a single currency is allowed, and it should be a three-letter ISO code (e.g., `usd`).
- `NEXT_PUBLIC_URL` – **Optional on Vercel** The address of your store without the trailing slash, i.e., `https://demo.yournextstore.com`. When building for the first time, you should set it to any valid URL, i.e. `http://localhost:3000`.

https://github.com/yournextstore/.github/assets/200613/01d27f69-00dc-446e-bc81-5dea2587f346

### Optional Environment Variables

- `NEXT_PUBLIC_UMAMI_WEBSITE_ID` – Umami website ID for analytics
- `NEXT_PUBLIC_NEWSLETTER_ENDPOINT` – **Preview**: The endpoint for the newsletter form in the future. It should accept POST requests with a JSON `{ email: string }` and return JSON `{ status: number }`.
- `STRIPE_WEBHOOK_SECRET` – **Preview**: Stripe Webhook secret for handling events from Stripe. Read more below.
- `ENABLE_STRIPE_TAX` – **Preview**: Set to any value (i.e., `1`) to enable Stripe Tax in YNS. Read more below.
- `NEXT_PUBLIC_LANGUAGE` - The locale of the store (i.e., `en-US`)

## Run the store

After following the above steps, run `bun install` to install the required dependencies, and then run `bun dev` to start the development server on your machine. Your Next Store will be available at [localhost:3000](http://localhost:3000)

## Add products

Your Next Store gets all the products, prices, descriptions, and categories from Stripe. So, if you know Stripe already, you'll feel right at home!

You need to add products to the Stripe Dashboard to show in YNS. After logging in, click **More** in the left sidebar and select **Product catalogue**. You may also use the direct link:

- In **Test Mode**: [dashboard.stripe.com/test/products](https://dashboard.stripe.com/test/products)
- In **Production Mode**: [dashboard.stripe.com/products](https://dashboard.stripe.com/products)

Then, click on **Add product** and fill in all the required information:

- name,
- description,
- price – currently, only _One-off_ payments are supported,
- a product image.

### Metadata

Additionally, Your Next Store uses product metadata to provide more context information about the products. You can specify the following metadata fields:

| Field      | Required | Description                                                                     |
| ---------- | :------: | ------------------------------------------------------------------------------- |
| `slug`     |   Yes    | The product slug is used for URLs. Needs to be unique except for variants.      |
| `category` |    No    | The product category used for grouping products.                                |
| `order`    |    No    | The product order used for sorting products. Lower numbers are displayed first. |
| `variant`  |    No    | The product variant slug. Read below for details.                               |

Now you should see all added products in Your Next Store.

## Variants

Your Next Store supports simple product variants. To create a product with variants, you must add multiple products to Stripe with the same `slug` metadata field. YNS uses the `variant` metadata field to distinguish between different variants of the same product. For example, if you have a T-shirt in multiple sizes, you can create three products with the `slug` of `t-shirt` and `variant` values of `small`, `medium`, and `large`.

Variants are displayed on the product page. Variants can have different prices, descriptions, and images. It's important to note that the `category` should be the same for all variants of the same product for the best browsing experience.

> [!NOTE]
> In the future, we plan to add the possibility of editing products and variants inside a built-in admin dashboard. If you have any ideas or suggestions, please let us know!

## Stripe Webhooks

Your Next Store uses Stripe Webhooks to handle events from Stripe. Currently, the endpoint is used to automatically revalidate cart page and to create tax transaction (if enabled). To set up Webhooks, follow the Stripe docs. The exact steps depend on whether you've activated Stripe Workbench in your Stripe account: [docs.stripe.com/webhooks#add-a-webhook-endpoint](https://docs.stripe.com/webhooks#add-a-webhook-endpoint).

The endpoint for the webhook is `https://{YOUR_DOMAIN}/api/stripe-webhook`. The only required event is `payment_intent.succeeded`. When the webhook is configured in Stripe, set the `STRIPE_WEBHOOK_SECRET` environment variable to the secret key created by Stripe.

> [!NOTE]
> In the future, we plan to add more events to the webhook to improve the user experience.

## Stripe Tax

Your Next Store comes with a preview of Stripe Tax support. To enable it, set the `ENABLE_STRIPE_TAX` environment variable to any value (i.e., `1`).

For this feature to work, you must set your Tax settings in Stripe Dashboard: [dashboard.stripe.com/register/tax](https://dashboard.stripe.com/register/tax). When enabled and configured, taxes will be automatically calculated and added to the total price of the product based on:

- product pricing - tax can be inclusive or exclusive
- product tax code
- customer's address
- customer's tax ID

> [!WARNING]
> This feature is still in the early stage, and there could be edge cases that are not supported. We're actively working on it, so if you encounter any problems or have any suggestions, please let us know!

## Production Deployment

### Vercel

To deploy on Vercel, click the following button, set up your GitHub repository and environment variables, and click **Deploy**. Make sure to set the `ENABLE_EXPERIMENTAL_COREPACK` variable to `1`.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fyournextstore%2Fyournextstore&env=ENABLE_EXPERIMENTAL_COREPACK,NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,STRIPE_SECRET_KEY,STRIPE_CURRENCY&envDescription=Read%20more%20about%20required%20env%20variables%20in%20YNS&envLink=https%3A%2F%2Fgithub.com%2Fyournextstore%2Fyournextstore%2Ftree%2Fupcoming%3Ftab%3Dreadme-ov-file%23add-environmental-variables&project-name=yournextstore&repository-name=yournextstore&demo-title=Your%20Next%20Store&demo-description=A%20Next.js%20boilerplate%20for%20building%20your%20online%20store%20instantly%3A%20simple%2C%20quick%2C%20powerful.&demo-url=https%3A%2F%2Fdemo.yournextstore.com%2F&demo-image=https%3A%2F%2Fyournextstore.com%2Fdemo.png)

### Your Own VPS

Description coming soon.

### Docker

To deploy on Docker, follow these steps:

1. Clone this repository into an empty folder and create the .env file in the repository as described [here](#add-environment-variables).
2. Set the variable DOCKER=1 in .env
3. Execute `bun run docker:build`.
4. After that, you can start the container with `bun run docker:run`.

## That's all

YNS evolves each day, and we actively seek feedback on what to improve. If you have any questions or problems, don't hesitate to get in touch with us on our Discord Server.

## FAQ

### Sometimes, you use `structuredClone` to pass data from server to client components. Why?

Only certain types of data can be passed from the server to the client directly. Data from Stripe SDK often contains class instances. To work around this, we use `structuredClone` to eliminate them and pass just plain old objects to the client.
