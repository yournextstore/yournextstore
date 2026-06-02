import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import { notFound } from "next/navigation";
import { ContactForm } from "@/app/contact/contact-form";
import { YnsLink } from "@/components/yns-link";
import { meGetCached } from "@/lib/commerce";
import { JsonLdScript } from "@/lib/json-ld";

export const metadata: Metadata = {
	title: "Contact Us",
	description:
		"Get in touch with our team. Questions about orders, products, or anything else — we're here to help.",
	alternates: { canonical: "/contact" },
	openGraph: {
		type: "website",
		title: "Contact Us",
		description:
			"Get in touch with our team. Questions about orders, products, or anything else — we're here to help.",
		url: "/contact",
	},
};

const contactJsonLd = {
	"@context": "https://schema.org",
	"@type": "ContactPage",
	name: "Contact Us",
	description: "Get in touch with our team. Questions about orders, products, or anything else.",
};

async function isContactFormEnabled(): Promise<boolean> {
	try {
		const me = await meGetCached();
		return me.store.settings?.enabledTools?.contactForm ?? false;
	} catch {
		return false;
	}
}

export default async function ContactPage() {
	"use cache";
	cacheLife("minutes");

	if (!(await isContactFormEnabled())) {
		notFound();
	}

	return (
		<div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
			<JsonLdScript data={contactJsonLd} />

			{/* Header */}
			<div className="mb-10">
				<YnsLink
					prefetch="eager"
					href="/"
					className="text-sm text-muted-foreground hover:text-foreground transition-colors"
				>
					Home
				</YnsLink>
				<span className="mx-2 text-muted-foreground">/</span>
				<span className="text-sm">Contact Us</span>
				<h1 className="mt-4 text-4xl font-medium tracking-tight">Contact Us</h1>
				<p className="mt-3 text-lg text-muted-foreground">
					Have a question or just want to say hello? Send us a message and we'll get back to you as soon as we
					can.
				</p>
			</div>

			{/* Form */}
			<ContactForm />

			{/* FAQ link */}
			<p className="mt-10 text-sm text-muted-foreground">
				Looking for a quick answer? Check our{" "}
				<YnsLink prefetch="eager" href="/faq" className="font-medium text-foreground hover:underline">
					frequently asked questions
				</YnsLink>
				.
			</p>
		</div>
	);
}
