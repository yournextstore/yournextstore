import Image from "next/image";
import { YnsLink } from "../yns-link";

const specs = [
	{ label: "Range", value: "78", unit: "MI" },
	{ label: "Top Speed", value: "40", unit: "MPH" },
	{ label: "Weight", value: "92", unit: "LB" },
	{ label: "Charge", value: "3.5", unit: "HRS" },
];

const press = ["Wired", "Monocle", "Dezeen", "Fast Company", "Wallpaper*", "ArchDigest"];

export function SpecStrip() {
	return (
		<section className="border-y border-border bg-background">
			<div className="mx-auto max-w-[1400px]">
				<div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-border">
					{specs.map((spec) => (
						<div key={spec.label} className="flex flex-col gap-3 bg-background px-6 sm:px-8 py-10 md:py-14">
							<span className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
								{spec.label}
							</span>
							<div className="flex items-baseline gap-2">
								<span className="font-display font-black text-5xl md:text-6xl tracking-tight tabular-nums text-foreground">
									{spec.value}
								</span>
								<span className="font-mono text-xs text-muted-foreground">{spec.unit}</span>
							</div>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}

export function Engineering() {
	return (
		<section className="relative overflow-hidden bg-[#f2f3f5]">
			<div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10 py-20 sm:py-28">
				<div className="grid gap-12 lg:grid-cols-12 lg:gap-16 items-center">
					<div className="lg:col-span-5">
						<span className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
							§ 02 — Engineering
						</span>
						<h2 className="mt-4 display-headline text-[clamp(2rem,5vw,3.5rem)] text-foreground">
							Built like a tool.
							<br />
							Detailed like a watch.
						</h2>
						<p className="mt-6 text-base leading-relaxed text-muted-foreground max-w-md">
							Every component is machined, finished, and tolerance-checked to spec. No plastics where metal
							belongs. No shortcuts where the eye lingers.
						</p>
						<ul className="mt-8 space-y-3 text-sm">
							{[
								["01", "CNC-milled 6061 aluminum chassis"],
								["02", "Hand-anodized titanium fasteners"],
								["03", "Modular battery — swap in 8 seconds"],
								["04", "IP67 weather sealing throughout"],
							].map(([num, label]) => (
								<li key={num} className="flex gap-4 border-b border-border pb-3 text-foreground">
									<span className="font-mono text-xs text-muted-foreground tabular-nums pt-0.5">{num}</span>
									<span className="font-medium">{label}</span>
								</li>
							))}
						</ul>
					</div>
					<div className="lg:col-span-7 relative">
						<div className="relative aspect-[4/3] overflow-hidden bg-[#1a1c1f]">
							<Image
								src="/scraped-1.jpg"
								alt="Engineering detail"
								fill
								sizes="(max-width: 1024px) 100vw, 60vw"
								className="object-cover"
							/>
							{/* Technical annotation overlays */}
							<div className="absolute inset-0 pointer-events-none">
								<div className="absolute left-[12%] top-[18%] flex items-center gap-2 text-[#f2f3f5]">
									<span className="size-1.5 rounded-full bg-[#22c55e]" />
									<span className="h-px w-12 bg-[#f2f3f5]/60" />
									<span className="font-mono text-[10px] uppercase tracking-[0.2em]">A · Hub Motor</span>
								</div>
								<div className="absolute right-[8%] bottom-[22%] flex items-center gap-2 text-[#f2f3f5]">
									<span className="font-mono text-[10px] uppercase tracking-[0.2em]">B · Frame Weld</span>
									<span className="h-px w-12 bg-[#f2f3f5]/60" />
									<span className="size-1.5 rounded-full bg-[#22c55e]" />
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}

export function Lifestyle() {
	return (
		<section className="relative bg-[#1a1c1f] text-[#f2f3f5]">
			<div className="relative aspect-[21/9] w-full overflow-hidden">
				<Image src="/scraped-2.jpg" alt="Lifestyle" fill sizes="100vw" className="object-cover opacity-90" />
				<div className="absolute inset-0 bg-gradient-to-t from-[#0a0b0c]/80 via-[#0a0b0c]/30 to-transparent" />
				<div className="absolute inset-x-0 bottom-0 mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10 pb-10 sm:pb-16">
					<div className="flex items-end justify-between gap-6">
						<div>
							<span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#c8ccd0]">
								§ 03 — In The Wild
							</span>
							<h3 className="mt-3 display-headline text-[clamp(2rem,5vw,4rem)] max-w-xl">
								Made for the city.
								<br />
								Tested on every road.
							</h3>
						</div>
						<YnsLink
							prefetch={"eager"}
							href="/products"
							className="hidden sm:inline-flex shrink-0 items-center gap-2 rounded-full border border-[#f2f3f5]/30 px-5 py-3 text-[13px] font-medium text-[#f2f3f5] backdrop-blur-sm transition-colors hover:bg-[#f2f3f5]/10"
						>
							Explore the Range
							<span aria-hidden>→</span>
						</YnsLink>
					</div>
				</div>
			</div>
		</section>
	);
}

export function PressRow() {
	return (
		<section className="bg-[#0f1012] text-[#f2f3f5]">
			<div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10 py-16 sm:py-24">
				<div className="grid gap-12 lg:grid-cols-12 lg:gap-16 items-center">
					<div className="lg:col-span-7">
						<span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#8a8f94]">
							As featured in
						</span>
						<blockquote className="mt-6 text-2xl sm:text-3xl lg:text-4xl font-display font-medium tracking-tight leading-[1.15] text-[#f2f3f5]">
							"A quiet rebuke to disposable design — engineered with the kind of restraint and obsession you
							rarely see in consumer goods."
						</blockquote>
						<div className="mt-6 flex items-center gap-3 text-sm text-[#8a8f94]">
							<span className="font-mono text-[10px] uppercase tracking-[0.3em]">Wired</span>
							<span className="h-px w-6 bg-[#3d4146]" />
							<span>Jan 2026</span>
						</div>
					</div>
					<div className="lg:col-span-5">
						<ul className="grid grid-cols-2 gap-x-6 gap-y-5">
							{press.map((name) => (
								<li
									key={name}
									className="font-display font-black text-lg sm:text-xl uppercase tracking-tight text-[#8a8f94]"
								>
									{name}
								</li>
							))}
						</ul>
					</div>
				</div>
			</div>
		</section>
	);
}

export function Reserve() {
	return (
		<section id="reserve" className="relative overflow-hidden bg-[#f2f3f5]">
			<div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10 py-20 sm:py-28">
				<div className="grid gap-10 lg:grid-cols-12 lg:gap-16 items-end">
					<div className="lg:col-span-7">
						<span className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
							§ 04 — Reserve
						</span>
						<h2 className="mt-4 display-headline text-[clamp(2.5rem,8vw,7rem)] text-foreground">
							Reserve
							<br />
							Yours.
						</h2>
						<p className="mt-6 max-w-md text-base leading-relaxed text-muted-foreground">
							Production runs are limited. Reserve with a refundable deposit to secure your build slot in the
							next manufacturing window.
						</p>
					</div>
					<div className="lg:col-span-5 lg:pl-8 lg:border-l border-border">
						<div className="flex items-baseline gap-3">
							<span className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
								From
							</span>
						</div>
						<div className="flex items-baseline gap-3 mt-2">
							<span className="font-display font-black text-6xl sm:text-7xl tracking-tight tabular-nums text-foreground">
								$4,800
							</span>
						</div>
						<p className="mt-2 text-xs text-muted-foreground">
							$200 refundable reservation · Final price at configuration
						</p>
						<div className="mt-8 flex flex-col sm:flex-row gap-3">
							<YnsLink
								prefetch={"eager"}
								href="/products"
								className="inline-flex flex-1 items-center justify-center gap-2 h-12 px-6 bg-[#1a1c1f] text-[#f2f3f5] text-[13px] font-medium tracking-wide hover:bg-[#3d4146] transition-colors"
							>
								<span className="relative flex size-2">
									<span className="absolute inset-0 rounded-full bg-[#22c55e] signal-dot" />
									<span className="relative inline-flex size-2 rounded-full bg-[#22c55e]" />
								</span>
								Reserve Now
							</YnsLink>
							<YnsLink
								prefetch={"eager"}
								href="/products"
								className="inline-flex flex-1 items-center justify-center gap-2 h-12 px-6 border border-foreground/20 text-foreground text-[13px] font-medium tracking-wide hover:bg-foreground hover:text-background transition-colors"
							>
								Configure
							</YnsLink>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}

export function About() {
	return (
		<>
			<SpecStrip />
			<Engineering />
			<Lifestyle />
			<PressRow />
			<Reserve />
		</>
	);
}
