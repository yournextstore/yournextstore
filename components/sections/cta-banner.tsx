import Image from "next/image";

function StoreBadge({ label, sub }: { label: string; sub: string }) {
	return (
		<a
			href="/products"
			className="inline-flex items-center gap-3 rounded-2xl bg-black/40 px-4 py-2.5 text-left text-white ring-1 ring-white/20 transition hover:bg-black/55"
		>
			<svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor" aria-hidden="true">
				<path d="M16.5 12.5a4.5 4.5 0 0 1 2.2-3.86A4.5 4.5 0 0 0 14.9 7c-1.5-.2-3 1-3.8 1s-2-1-3.3-1A4.7 4.7 0 0 0 3.5 9.4c-1.7 3 .4 7.4 2 9.8.8 1.2 1.8 2.6 3 2.6s1.6-.8 3-.8 1.8.8 3 .8 2.1-1.2 3-2.4a10.6 10.6 0 0 0 1.3-2.7 4.5 4.5 0 0 1-2.3-4ZM14 4.5a4.4 4.4 0 0 0 1.1-3.2 4.5 4.5 0 0 0-3 1.6 4.2 4.2 0 0 0-1 3 3.6 3.6 0 0 0 2.9-1.4Z" />
			</svg>
			<div className="leading-tight">
				<div className="text-[10px] uppercase tracking-wider opacity-70">{sub}</div>
				<div className="font-display text-sm font-semibold">{label}</div>
			</div>
		</a>
	);
}

export function CtaBanner() {
	return (
		<section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
			<div className="relative overflow-hidden rounded-[28px] bg-plum-mesh px-6 py-8 text-white shadow-card sm:px-10 sm:py-12 lg:px-14">
				<div
					aria-hidden="true"
					className="pointer-events-none absolute -left-32 -top-32 h-72 w-72 rounded-full bg-[var(--accent-rose)]/30 blur-3xl"
				/>
				<div
					aria-hidden="true"
					className="pointer-events-none absolute -right-20 -bottom-20 h-72 w-72 rounded-full bg-[var(--accent-saffron)]/25 blur-3xl"
				/>

				<div className="relative grid items-center gap-8 sm:grid-cols-[1.2fr_1fr]">
					<div>
						<span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-[var(--accent-saffron)]">
							Get the app
						</span>
						<h2 className="mt-4 font-display text-3xl font-bold leading-tight sm:text-4xl lg:text-[42px]">
							Stay home and get all your essentials from our market!
						</h2>
						<p className="mt-4 max-w-md text-sm text-white/75 sm:text-base">
							Tap, schedule, and unwind. We&apos;ll deliver groceries, dairy, and pantry staples straight to
							your doorstep — every day of the week.
						</p>
						<div className="mt-7 flex flex-wrap gap-3">
							<StoreBadge sub="Download on the" label="App Store" />
							<StoreBadge sub="Get it on" label="Google Play" />
						</div>
					</div>

					<div className="relative mx-auto aspect-square w-full max-w-sm">
						<Image
							src="/scraped-4.jpg"
							alt="Delivery courier with a basket of fresh groceries"
							fill
							sizes="(max-width: 768px) 80vw, 420px"
							className="object-contain drop-shadow-2xl"
						/>
						<div className="absolute -bottom-2 left-1/2 h-3 w-2/3 -translate-x-1/2 rounded-full bg-black/40 blur-md" />
					</div>
				</div>
			</div>
		</section>
	);
}
