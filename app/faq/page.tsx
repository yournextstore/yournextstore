import { Mail } from "lucide-react";
import type { Metadata } from "next";
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
				<a key={category.id} href={`#${category.id}`} className="chip">
					{category.title}
				</a>
			))}
		</nav>
	);
}

function FAQSection({ category }: { category: FAQCategory }) {
	return (
		<section id={category.id} className="scroll-mt-24">
			<h2 className="mb-4 text-[1.6rem] text-ink">{category.title}</h2>
			<Accordion type="single" collapsible className="panel-card px-5">
				{category.questions.map((item, index) => (
					<AccordionItem key={`${category.id}-${index}`} value={`${category.id}-${index}`}>
						<AccordionTrigger>{item.question}</AccordionTrigger>
						<AccordionContent>
							<p className="text-muted-foreground leading-relaxed">{item.answer}</p>
						</AccordionContent>
					</AccordionItem>
				))}
			</Accordion>
		</section>
	);
}

function ContactCard() {
	return (
		<div className="panel-card p-8 text-center">
			<h2 className="text-[1.6rem] text-ink">Still have questions?</h2>
			<p className="mt-2 text-muted-foreground">
				We're here to help. Reach out and we'll get back to you as soon as possible.
			</p>
			<div className="mt-6 inline-flex items-center gap-2 text-sm font-medium">
				<Mail className="h-4 w-4" />
				<span>Contact us via the details on our website</span>
			</div>
		</div>
	);
}

export default function FAQPage() {
	return (
		<div className="mx-auto max-w-3xl px-[1.2rem] pt-[clamp(3rem,7vw,5rem)] pb-24">
			<JsonLdScript data={buildFaqJsonLd(faqCategories)} />
			{/* Header */}
			<div className="mb-10">
				<p className="kicker">FAQ</p>
				<h1 className="title-section mt-4 text-ink">Questions from the bench.</h1>
				<p className="lead mt-5">
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
	);
}
