import { Mail } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { type FAQCategory, faqCategories } from "@/app/faq/faq-data";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { getStoreSeo } from "@/lib/commerce";
import { JsonLdScript } from "@/lib/json-ld";

// `next dev` and `next build` fail if anything on this route renders per request (AGENTS.md).
export const ensureStatic = "navigation";

export async function generateMetadata(): Promise<Metadata> {
	const { storeName } = await getStoreSeo();
	const description = `Frequently asked questions about orders, payments, shipping, and returns at ${storeName}.`;

	return {
		title: "FAQ",
		description,
		alternates: { canonical: "/faq" },
		openGraph: {
			type: "website",
			title: "Frequently Asked Questions",
			description,
			url: "/faq",
		},
	};
}

function buildFaqJsonLd(categories: FAQCategory[]): Record<string, unknown> {
	const mainEntity = categories.flatMap((category) =>
		category.questions.map((q) => ({
			"@type": "Question",
			name: q.question,
			acceptedAnswer: {
				"@type": "Answer",
				text: q.answer,
			},
		})),
	);

	return {
		"@context": "https://schema.org",
		"@type": "FAQPage",
		mainEntity,
	};
}

function CategoryNav({ categories }: { categories: FAQCategory[] }) {
	return (
		<nav className="flex flex-wrap gap-2">
			{categories.map((category) => (
				<a
					key={category.id}
					href={`#${category.id}`}
					className="border border-border px-4 py-2.5 text-[14px] text-muted-foreground transition hover:border-foreground hover:text-foreground"
				>
					{category.title}
				</a>
			))}
		</nav>
	);
}

function FAQSection({ category }: { category: FAQCategory }) {
	return (
		<section id={category.id} className="scroll-mt-24">
			<h2 className="mb-4 font-display text-[20px] font-semibold uppercase tracking-[0.08em]">
				{category.title}
			</h2>
			<Accordion type="single" collapsible className="border border-border bg-card/40">
				{category.questions.map((item, index) => (
					<AccordionItem
						key={`${category.id}-${index}`}
						value={`${category.id}-${index}`}
						className="px-6 transition-colors data-[state=open]:bg-[#0a0a0a] data-[state=open]:text-white sm:px-8"
					>
						<AccordionTrigger className="text-[15px] font-semibold">{item.question}</AccordionTrigger>
						<AccordionContent>
							<p className="max-w-[62ch] text-[14px] leading-relaxed text-white/75">{item.answer}</p>
						</AccordionContent>
					</AccordionItem>
				))}
			</Accordion>
		</section>
	);
}

function ContactCard() {
	return (
		<div className="bg-[#0a0a0a] p-8 text-center text-white">
			<h2 className="font-display text-2xl font-semibold uppercase tracking-[0.04em]">
				Still have questions?
			</h2>
			<p className="mt-2 text-white/75">
				We're here to help. Reach out and we'll get back to you as soon as possible.
			</p>
			<div className="mt-6 inline-flex items-center gap-2 text-sm font-medium">
				<Mail className="h-4 w-4" aria-hidden />
				<span>Contact us via the details on our website</span>
			</div>
		</div>
	);
}

export default function FAQPage() {
	return (
		<div className="light-section">
			<div className="mx-auto max-w-3xl px-5 py-10 sm:py-14">
				<JsonLdScript data={buildFaqJsonLd(faqCategories)} />
				{/* Header */}
				<div className="mb-10">
					<Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
						Home
					</Link>
					<span className="mx-2 text-muted-foreground">/</span>
					<span className="text-sm">FAQ</span>
					<h1 className="mt-4 font-display text-[clamp(26px,5vw,52px)] font-semibold uppercase leading-tight tracking-[0.04em]">
						Asked often
					</h1>
					<p className="mt-3 text-[16px] leading-relaxed text-muted-foreground">
						Find answers to the most common questions about your orders, payments, shipping, and more.
					</p>
				</div>

				{/* Category Navigation */}
				<div className="mb-10">
					<CategoryNav categories={faqCategories} />
				</div>

				{/* FAQ Sections */}
				<div className="space-y-12">
					{faqCategories.map((category) => (
						<FAQSection key={category.id} category={category} />
					))}
				</div>

				{/* Contact Card */}
				<div className="mt-16">
					<ContactCard />
				</div>
			</div>
		</div>
	);
}
