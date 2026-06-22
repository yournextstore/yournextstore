import Image from "next/image";
import { YnsLink } from "../yns-link";

export function ScentQuiz() {
	return (
		<section className="relative isolate overflow-hidden bg-ink">
			<div className="relative h-[78svh] min-h-[520px] w-full">
				<Image src="/scraped-4.jpg" alt="" fill sizes="100vw" className="object-cover object-center" />
				<div
					aria-hidden
					className="absolute inset-0"
					style={{
						background:
							"radial-gradient(ellipse at 30% 50%, rgba(10,8,7,0.1) 0%, rgba(10,8,7,0.65) 70%, rgba(10,8,7,0.92) 100%)",
					}}
				/>
				<div className="absolute inset-0 flex items-center px-6 sm:px-12 lg:px-20">
					<div className="max-w-2xl">
						<p className="text-[10px] tracking-microcaps text-bone/65">The Scent Quiz</p>
						<h2 className="mt-4 font-serif-display text-4xl leading-[0.98] text-bone sm:text-6xl lg:text-7xl">
							Which chapter
							<br />
							<span className="italic text-saffron">are you?</span>
						</h2>
						<p className="mt-6 max-w-md text-[15px] leading-relaxed text-bone/70">
							Six questions, no perfume bro vocabulary, an honest answer. We&rsquo;ll send three samples to
							your door.
						</p>
						<YnsLink
							prefetch={"eager"}
							href="/products"
							className="mt-10 inline-block border-b border-bone/40 pb-1 text-[11px] tracking-microcaps text-bone transition-colors hover:border-saffron hover:text-saffron"
						>
							Begin the quiz →
						</YnsLink>
					</div>
				</div>
			</div>
		</section>
	);
}
