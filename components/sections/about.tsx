import { ArrowRightIcon } from "lucide-react";
import { YnsLink } from "../yns-link";

type AboutProps = {
	isPreview?: boolean;
};

export function About({ isPreview = false }: AboutProps) {
	const href = isPreview ? "/faq?preview=1" : "/faq";

	return (
		<section id="about" className="bg-aura-clay text-cream py-20 sm:py-28">
			<div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="grid sm:grid-cols-[auto_1fr] gap-10 sm:gap-16 items-end">
					<p className="text-[11px] uppercase tracking-[0.32em] text-cream/70 sm:[writing-mode:vertical-rl] sm:rotate-180">
						Our story · Atelier
					</p>
					<div>
						<h2 className="font-serif text-3xl sm:text-5xl tracking-tight leading-tight text-balance">
							Founded in a Puglian courtyard in 2018, our atelier is a small studio of makers who believe a
							home should feel like a long, slow afternoon —
							<span className="italic"> warm, quiet, lived-in.</span>
						</h2>
						<YnsLink
							href={href}
							prefetch={"eager"}
							className="mt-10 inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] border-b border-cream/40 pb-1.5 hover:border-cream"
						>
							Meet the makers
							<ArrowRightIcon className="h-3.5 w-3.5" />
						</YnsLink>
					</div>
				</div>
			</div>
		</section>
	);
}
