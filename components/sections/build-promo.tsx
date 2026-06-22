import { Sparkles } from "lucide-react";
import Image from "next/image";
import { YnsLink } from "../yns-link";

export function BuildPromo() {
	return (
		<section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
			<div className="relative overflow-hidden rounded-3xl border border-white/8 bg-card">
				<Image
					src="/scraped-4.jpg"
					alt=""
					fill
					sizes="100vw"
					className="object-cover opacity-40"
					aria-hidden="true"
				/>
				<div
					className="absolute inset-0"
					style={{
						background:
							"linear-gradient(90deg, rgba(15,14,18,0.92) 0%, rgba(15,14,18,0.6) 50%, rgba(168,85,247,0.35) 100%)",
					}}
				/>
				<div className="bg-grid absolute inset-0 opacity-30" aria-hidden="true" />

				<div className="relative grid lg:grid-cols-2 gap-8 items-center px-6 sm:px-12 py-12 sm:py-16">
					<div>
						<div className="inline-flex items-center gap-2 mb-5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 backdrop-blur-sm">
							<Sparkles className="h-3 w-3 text-primary" />
							<span className="text-[11px] tracking-[0.18em] uppercase text-muted-foreground">
								Configurator
							</span>
						</div>
						<h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-foreground leading-[1.05]">
							Build it your way.
							<br />
							<span className="bg-gradient-to-r from-[#d946c4] to-[#a855f7] bg-clip-text text-transparent">
								Ship in 72 hours.
							</span>
						</h2>
						<p className="mt-5 text-base text-muted-foreground max-w-md leading-relaxed">
							Pick a chassis, lock in your silicon, dial the cooling. Our configurator validates every
							combination in real-time — no incompatible parts, no compromises.
						</p>
						<div className="mt-8 flex flex-wrap gap-3">
							<YnsLink
								href="/products"
								prefetch={"eager"}
								className="btn-neon inline-flex h-11 items-center justify-center px-6 rounded-full text-sm font-semibold text-white"
							>
								Start configurator
							</YnsLink>
							<YnsLink
								href="/products"
								prefetch={"eager"}
								className="ghost-pill inline-flex h-11 items-center justify-center px-6 rounded-full text-sm font-medium text-foreground"
							>
								Pre-built rigs
							</YnsLink>
						</div>
					</div>

					{/* spec card */}
					<div className="hidden lg:block relative">
						<div className="ml-auto max-w-sm rounded-2xl border border-white/10 bg-background/60 backdrop-blur-xl p-6">
							<div className="text-[10px] uppercase tracking-[0.2em] text-primary mb-3">Reference spec</div>
							<div className="space-y-3">
								{[
									["CPU", "Ryzen 9 7950X"],
									["GPU", "RTX 4090 24GB"],
									["RAM", "64GB DDR5-6000"],
									["Storage", "2TB Gen4 NVMe"],
									["Cooling", "360mm AIO + 7 fans"],
								].map(([k, v]) => (
									<div
										key={k}
										className="flex items-baseline justify-between border-b border-white/5 pb-2 last:border-0 last:pb-0"
									>
										<span className="text-[11px] uppercase tracking-wider text-muted-foreground">{k}</span>
										<span className="text-sm font-medium text-foreground font-display">{v}</span>
									</div>
								))}
							</div>
							<div className="mt-5 flex items-baseline justify-between">
								<span className="text-xs text-muted-foreground">From</span>
								<span className="font-display text-2xl font-semibold text-foreground">$4,299</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
