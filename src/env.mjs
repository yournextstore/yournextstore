// @ts-check

import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
	server: {
		// Can be provided via env or parameters to Commerce Kit, thus optional
		STRIPE_SECRET_KEY: z.string().optional(),
		// Required in Commerce Kit
		STRIPE_CURRENCY: z.string(),
		STRIPE_WEBHOOK_SECRET: z.string().optional(),

		ENABLE_STRIPE_TAX: z
			.string()
			.optional()
			.transform((str) => !!str),

		TRIEVE_DATASET_ID: z.string().optional(),
		TRIEVE_API_KEY: z.string().optional(),
	},
	client: {
		// Can be provided via env or parameters to Commerce Kit, thus optional
		NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().optional(),
		NEXT_PUBLIC_URL: z.string().url().optional(),

		NEXT_PUBLIC_UMAMI_WEBSITE_ID: z.string().optional(),

		NEXT_PUBLIC_NEWSLETTER_ENDPOINT: z.string().optional(),

		NEXT_PUBLIC_LANGUAGE: z.string().optional().default("en-US"),
	},
	runtimeEnv: {
		STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
		STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
		STRIPE_CURRENCY: process.env.STRIPE_CURRENCY,

		NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
		NEXT_PUBLIC_URL: process.env.NEXT_PUBLIC_URL,
		NEXT_PUBLIC_UMAMI_WEBSITE_ID: process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID,
		NEXT_PUBLIC_NEWSLETTER_ENDPOINT: process.env.NEXT_PUBLIC_NEWSLETTER_ENDPOINT,

		ENABLE_STRIPE_TAX: process.env.ENABLE_STRIPE_TAX,

		TRIEVE_DATASET_ID: process.env.TRIEVE_DATASET_ID,
		TRIEVE_API_KEY: process.env.TRIEVE_API_KEY,

		NEXT_PUBLIC_LANGUAGE: process.env.NEXT_PUBLIC_LANGUAGE,
	},
});

const vercelHost =
	process.env.NEXT_PUBLIC_VERCEL_ENV === "production"
		? process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL
		: process.env.NEXT_PUBLIC_VERCEL_URL;
const vercelUrl = vercelHost ? `https://${vercelHost}` : undefined;
const publicUrl = process.env.NEXT_PUBLIC_URL || vercelUrl;

if (!publicUrl) {
	throw new Error("Missing NEXT_PUBLIC_URL or NEXT_PUBLIC_VERCEL_URL variables!");
}

// force type inference to string
const _publicUrl = publicUrl;
export { _publicUrl as publicUrl };
