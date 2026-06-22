import Image from "next/image";
import { YnsLink } from "@/components/yns-link";

export function Hero() {
	return (
		<section className="relative overflow-hidden bg-[#f0f0f0]">
			{/* Yellow halftone background — the "splash" behind the headline */}
			<div aria-hidden="true" className="absolute inset-0">
				<div className="absolute inset-y-0 left-0 right-0 wip-halftone-fade" />
				<div
					className="absolute inset-y-0 right-0 w-[78%] sm:w-[68%] lg:w-[62%]"
					style={{
						background:
							"linear-gradient(105deg, transparent 0%, transparent 10%, var(--zap) 20%, var(--zap) 100%)",
					}}
				/>
				{/* Halftone dot overlay */}
				<div
					className="absolute inset-0 opacity-40 mix-blend-multiply"
					style={{
						backgroundImage:
							"radial-gradient(circle, #0a0a0a 1.4px, transparent 1.6px), radial-gradient(circle, #0a0a0a 1.1px, transparent 1.3px)",
						backgroundSize: "14px 14px, 22px 22px",
						backgroundPosition: "0 0, 11px 11px",
						maskImage:
							"linear-gradient(110deg, transparent 0%, transparent 18%, black 35%, black 80%, transparent 100%)",
						WebkitMaskImage:
							"linear-gradient(110deg, transparent 0%, transparent 18%, black 35%, black 80%, transparent 100%)",
					}}
				/>
				{/* Big diagonal yellow sweep */}
				<svg
					viewBox="0 0 1400 700"
					preserveAspectRatio="none"
					className="absolute inset-0 h-full w-full"
					aria-hidden="true"
				>
					<title>hero sweep</title>
					<path d="M -100 720 L 480 -50 L 760 -50 L 180 720 Z" fill="#f1f23b" fillOpacity="0.95" />
					<path d="M 380 720 L 980 -50 L 1100 -50 L 500 720 Z" fill="#f1f23b" fillOpacity="0.7" />
				</svg>
			</div>

			<div className="relative mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10">
				<div className="grid min-h-[640px] grid-cols-1 items-center gap-8 py-16 sm:py-20 lg:min-h-[680px] lg:grid-cols-12 lg:gap-6 lg:py-24">
					{/* Headline + CTA */}
					<div className="lg:col-span-7">
						<h1 className="font-display text-[16vw] leading-[0.85] tracking-tight text-foreground sm:text-[13vw] lg:text-[8.5rem] xl:text-[10rem] uppercase">
							A New
							<br />
							Era of
							<br />
							Energy.
						</h1>
						<div className="mt-12 max-w-md lg:mt-16">
							<p className="text-lg font-semibold tracking-tight text-foreground sm:text-xl">
								Natural caffeine energy pouches.
							</p>
							<div className="mt-5">
								<YnsLink
									prefetch={"eager"}
									href="/products"
									className="inline-flex items-center justify-center rounded-full bg-foreground px-8 py-3.5 text-sm font-semibold uppercase tracking-[0.16em] text-background transition-all hover:bg-foreground/85 hover:-translate-y-0.5"
								>
									Shop Pouches
								</YnsLink>
							</div>
						</div>
					</div>

					{/* Floating product visual */}
					<div className="relative lg:col-span-5">
						<div className="relative mx-auto aspect-square w-[78%] max-w-md lg:w-full">
							<div
								aria-hidden="true"
								className="absolute -inset-6 rounded-full opacity-30 blur-2xl"
								style={{ background: "radial-gradient(circle, #0a0a0a 0%, transparent 70%)" }}
							/>
							<div className="relative animate-wip-float">
								<Image
									src="/scraped-0.jpg"
									alt="YNS energy pouches tin"
									width={520}
									height={520}
									priority
									className="h-auto w-full drop-shadow-[0_30px_40px_rgba(0,0,0,0.35)]"
								/>
							</div>
							{/* Floating pouches */}
							<div className="absolute -bottom-2 left-4 hidden sm:block">
								<div
									className="h-10 w-24 rounded-full bg-gradient-to-br from-[#1abfb0] to-[#0fa599] shadow-lg"
									style={{ transform: "rotate(-18deg)" }}
								/>
							</div>
							<div className="absolute -bottom-6 right-6 hidden sm:block">
								<div
									className="h-10 w-24 rounded-full bg-gradient-to-br from-[#1abfb0] to-[#0fa599] shadow-lg"
									style={{ transform: "rotate(14deg)" }}
								/>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Subtle bottom border */}
			<div aria-hidden="true" className="relative h-px w-full bg-foreground/10" />
		</section>
	);
}
