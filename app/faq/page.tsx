import { Mail } from "lucide-react";
import type { Metadata } from "next";
import { type FAQCategory, faqCategories } from "@/app/faq/faq-data";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { YnsLink } from "@/components/yns-link";

export const metadata: Metadata = {
	title: "FAQ — Your Next Store",
	description: "Frequently asked questions about orders, payments, shipping, returns, and more.",
};

function CategoryNav({ categories }: { categories: FAQCategory[] }) {
	return (
		<nav className="flex flex-wrap gap-2">
			{categories.map((category) => (
				<a
					key={category.id}
					href={`#${category.id}`}
					className="rounded-full border border-border px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
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
			<h2 className="text-2xl font-medium tracking-tight mb-4">{category.title}</h2>
			<Accordion type="single" collapsible className="rounded-lg border border-border px-4">
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
		<div className="rounded-lg border border-border bg-secondary/30 p-8 text-center">
			<h2 className="text-2xl font-medium tracking-tight">Still have questions?</h2>
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
		<div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
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
				<span className="text-sm">FAQ</span>
				<h1 className="mt-4 text-4xl font-medium tracking-tight">Frequently Asked Questions</h1>
				<p className="mt-3 text-lg text-muted-foreground">
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
