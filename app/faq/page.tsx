import type { Metadata } from "next";
import Link from "next/link";
import { type FAQCategory, faqCategories } from "@/app/faq/faq-data";
import { FaqList, PageShell } from "@/components/bento/page-shell";
import { getStoreBasics } from "@/lib/aqua";
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
		<nav aria-label="FAQ topics" className="flex flex-wrap gap-2">
			{categories.map((category) => (
				<a
					key={category.id}
					href={`#${category.id}`}
					className="rounded-full border border-white/15 px-4 py-2 text-sm text-[#d4d4d4] transition-colors hover:border-amber/50 hover:text-amber"
				>
					{category.title}
				</a>
			))}
		</nav>
	);
}

export default async function FAQPage() {
	const { contactForm } = await getStoreBasics();
	return (
		<PageShell
			eyebrow="Help"
			title="Questions, answered."
			intro="Orders, payments, shipping and returns: the things people ask before and after they buy."
		>
			<JsonLdScript data={buildFaqJsonLd(faqCategories)} />
			<div className="mb-12">
				<CategoryNav categories={faqCategories} />
			</div>
			<div className="space-y-12">
				{faqCategories.map((category) => (
					<section key={category.id} id={category.id} className="scroll-mt-28">
						<h2 className="mb-2 text-xl font-normal">{category.title}</h2>
						<FaqList items={category.questions.map((q) => ({ question: q.question, answer: q.answer }))} />
					</section>
				))}
			</div>
			<div className="mt-16 rounded-[2rem] border border-line bg-white/[0.02] p-1.5">
				<div className="rounded-[calc(2rem-0.375rem)] bg-panel-2 px-8 py-10 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
					<h2 className="text-2xl font-normal">Still have questions?</h2>
					<p className="mt-2 text-[#a3a3a3]">Real people answer, before and after you buy.</p>
					<Link
						href={contactForm ? "/contact" : "/about"}
						className="mt-6 inline-flex rounded-full bg-amber px-6 py-3 text-sm font-semibold text-black transition hover:brightness-110"
					>
						{contactForm ? "Write to us" : "About the shop"}
					</Link>
				</div>
			</div>
		</PageShell>
	);
}
