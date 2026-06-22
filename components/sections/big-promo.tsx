import Image from "next/image";
import { YnsLink } from "@/components/yns-link";

export function BigPromo() {
	return (
		<section className="relative overflow-hidden bg-zap">
			<div
				aria-hidden="true"
				className="absolute inset-0 opacity-30 mix-blend-multiply"
				style={{
					backgroundImage: "radial-gradient(circle, #0a0a0a 1.6px, transparent 1.8px)",
					backgroundSize: "20px 20px",
				}}
			/>
			<div className="relative mx-auto grid max-w-[1400px] grid-cols-1 items-center gap-10 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-2 lg:px-10">
				<div className="relative aspect-square overflow-hidden">
					<Image
						src="/scraped-5.jpg"
						alt="YNS lifestyle"
						fill
						sizes="(max-width: 1024px) 100vw, 50vw"
						className="object-cover"
					/>
				</div>
				<div>
					<p className="text-xs font-semibold uppercase tracking-[0.24em] text-foreground/70">
						The Sweepstakes
					</p>
					<h2 className="mt-3 font-display text-5xl uppercase leading-[0.88] sm:text-6xl lg:text-7xl">
						Win $10,000.
						<br />
						<span className="text-foreground/70">Every $5 spent.</span>
					</h2>
					<p className="mt-6 max-w-md text-base text-foreground/80">
						Every order is automatically entered. The more you stock up, the better your odds. No purchase
						necessary — full rules in the FAQ.
					</p>
					<div className="mt-8 flex flex-wrap gap-3">
						<YnsLink
							prefetch={"eager"}
							href="/products"
							className="inline-flex items-center justify-center rounded-full bg-foreground px-7 py-3.5 text-xs font-semibold uppercase tracking-[0.18em] text-background transition-all hover:-translate-y-0.5"
						>
							Enter Now
						</YnsLink>
						<YnsLink
							prefetch={"eager"}
							href="/faq"
							className="inline-flex items-center justify-center rounded-full border-2 border-foreground px-7 py-3.5 text-xs font-semibold uppercase tracking-[0.18em] text-foreground transition-all hover:bg-foreground hover:text-background"
						>
							Read Rules
						</YnsLink>
					</div>
				</div>
			</div>
		</section>
	);
}
