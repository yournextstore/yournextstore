import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ContactForm } from "@/app/contact/contact-form";
import { getStoreSeo } from "@/lib/commerce";
import { JsonLdScript } from "@/lib/json-ld";
import { isStoreToolEnabled } from "@/lib/store-tools";

// `next dev` and `next build` fail if anything on this route renders per request (AGENTS.md).
export const ensureStatic = "navigation";

export async function generateMetadata(): Promise<Metadata> {
	const { storeName } = await getStoreSeo();
	const description = `Get in touch with the ${storeName} team. Questions about orders, products, or anything else — we're here to help.`;

	return {
		title: "Contact Us",
		description,
		alternates: { canonical: "/contact" },
		openGraph: {
			type: "website",
			title: "Contact Us",
			description,
			url: "/contact",
		},
	};
}

const contactJsonLd = {
	"@context": "https://schema.org",
	"@type": "ContactPage",
	name: "Contact Us",
	description: "Get in touch with our team. Questions about orders, products, or anything else.",
};

export default async function ContactPage() {
	"use cache";
	cacheLife("minutes");

	if (!(await isStoreToolEnabled("contactForm"))) {
		notFound();
	}

	return (
		<div className="mx-8 max-w-2xl py-20 sm:mx-auto">
			<JsonLdScript data={contactJsonLd} />

			<div className="mb-10">
				<h1 className="mb-8 text-5xl font-bold">Contact</h1>
				<p className="text-base leading-7">
					Have a question or just want to say hello? Send us a message and we'll get back to you as soon as we
					can.
				</p>
			</div>

			{/* Form */}
			<ContactForm />

			{/* FAQ link */}
			<p className="mt-10 text-sm text-muted-foreground">
				Looking for a quick answer? Check our{" "}
				<Link href="/faq" className="font-medium text-foreground hover:underline">
					frequently asked questions
				</Link>
				.
			</p>
		</div>
	);
}
