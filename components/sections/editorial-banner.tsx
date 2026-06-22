import Image from "next/image";

export function EditorialBanner() {
	return (
		<section className="relative w-full bg-ink text-bone overflow-hidden">
			<div className="relative h-[62vh] min-h-[460px] w-full">
				<Image
					src="/scraped-2.jpg"
					alt="A moment in the city"
					fill
					sizes="100vw"
					className="object-cover object-center grayscale contrast-[1.1] brightness-[0.85]"
				/>
				<div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(27,29,32,0.55)_0%,rgba(27,29,32,0.3)_45%,rgba(27,29,32,0.75)_100%)]" />
				<div className="absolute inset-0 bg-grain opacity-30 mix-blend-overlay" />

				<div className="relative z-10 h-full max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
					<span className="text-[11px] tracking-[0.3em] uppercase text-bone/70 mb-6">
						<span className="text-brick">●</span> A note from a customer
					</span>
					<blockquote className="max-w-3xl text-[clamp(1.4rem,3vw,2.4rem)] leading-[1.18] italic font-serif text-bone text-balance">
						&ldquo;Genuinely the most useful thing I&apos;ve bought in years. I planned my Saturday around
						pulling this thing to the market and back. It&apos;s a love affair.&rdquo;
					</blockquote>
					<div className="mt-7 flex items-center gap-4 text-[11px] tracking-[0.3em] uppercase text-bone/80">
						<span className="block w-10 h-px bg-brick" />
						<span>Mae L. — Brooklyn, NY</span>
						<span className="hidden sm:inline opacity-60">· Verified buyer</span>
					</div>
				</div>

				<div className="absolute bottom-5 left-4 sm:left-6 right-4 sm:right-6 z-10 flex items-end justify-between text-[10px] tracking-[0.3em] uppercase text-bone/55">
					<span>03 / Editorial</span>
					<span className="hidden md:inline">YNS · Field Notes</span>
				</div>
			</div>
		</section>
	);
}
