import Image from "next/image";
import { YnsLink } from "../yns-link";

export function LifestyleBand() {
	return (
		<section className="relative isolate overflow-hidden">
			<div className="relative h-[60vh] min-h-[420px] max-h-[640px] w-full">
				<Image
					src="/scraped-2.jpg"
					alt="Travel photograph: Mediterranean hillside village at golden hour"
					fill
					sizes="100vw"
					className="object-cover object-center"
				/>
				<div className="absolute inset-0 bg-gradient-to-t from-ink/45 via-ink/15 to-ink/25" />

				<div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
					<p className="text-white/85 text-[11px] tracking-[0.32em] uppercase mb-4">
						Postcards From Andalusia
					</p>
					<blockquote className="font-serif text-white text-3xl sm:text-5xl lg:text-6xl leading-[1.05] tracking-tight max-w-3xl drop-shadow-[0_2px_18px_rgba(0,0,0,0.35)]">
						<span className="inline-block">&ldquo;Long lunches,&nbsp;</span>
						<br className="hidden sm:block" />
						<span className="italic">cobbled streets,</span>
						<br className="hidden sm:block" />
						<span className="inline-block">a dress that travels.&rdquo;</span>
					</blockquote>
					<YnsLink
						prefetch="eager"
						href="/products"
						className="mt-9 inline-flex items-center justify-center h-12 px-10 bg-cream text-ink text-[11px] font-semibold tracking-[0.22em] uppercase hover:bg-white transition-colors"
					>
						Shop The Look
					</YnsLink>
				</div>
			</div>
		</section>
	);
}
