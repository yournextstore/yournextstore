import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** The reference's content-page opener: amber rule + eyebrow, large title, muted intro. */
export function PageShell({
	eyebrow,
	title,
	intro,
	wide = false,
	className,
	children,
}: {
	eyebrow?: string;
	title: ReactNode;
	intro?: ReactNode;
	wide?: boolean;
	className?: string;
	children: ReactNode;
}) {
	return (
		<div className={cn("mx-auto px-6 py-16 md:py-24", wide ? "max-w-5xl" : "max-w-3xl", className)}>
			{eyebrow ? (
				<div className="mb-3 flex items-center gap-3">
					<span aria-hidden="true" className="h-px w-7 bg-amber" />
					<span className="text-xs font-semibold tracking-[0.18em] text-amber uppercase">{eyebrow}</span>
				</div>
			) : null}
			<h1 className="text-4xl font-normal wrap-break-word md:text-5xl">{title}</h1>
			{intro ? <div className="mt-4 text-lg leading-relaxed text-[#a3a3a3]">{intro}</div> : null}
			<div className="mt-10">{children}</div>
		</div>
	);
}

/** A titled block of body copy inside a PageShell. */
export function Section({ heading, children }: { heading?: string; children: ReactNode }) {
	return (
		<section className="mb-10">
			{heading ? <h2 className="mb-3 text-xl font-normal text-bone">{heading}</h2> : null}
			<div className="space-y-3 text-[15px] leading-relaxed text-[#c9cdc9]">{children}</div>
		</section>
	);
}

/** Hairline-divided question list with a rotating plus (no-JS <details>). */
export function FaqList({ items }: { items: { question: string; answer: string }[] }) {
	return (
		<div className="divide-y divide-line border-y border-line">
			{items.map((item) => (
				<details key={item.question} className="group py-5">
					<summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[15px] font-medium text-bone [&::-webkit-details-marker]:hidden">
						{item.question}
						<span
							aria-hidden="true"
							className="text-xl leading-none text-[#8a9a9c] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-open:rotate-45"
						>
							+
						</span>
					</summary>
					<p className="mt-3 text-[15px] leading-relaxed text-[#a3a3a3]">{item.answer}</p>
				</details>
			))}
		</div>
	);
}
