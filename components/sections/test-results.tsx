import Image from "next/image";

const rows = [
	{ name: "Fluoride", us: "0.7 mg/L", yns: "Not detected", limit: "4.0 mg/L" },
	{ name: "Chlorine", us: "1.4 mg/L", yns: "Not detected", limit: "4.0 mg/L" },
	{ name: "Microplastics", us: "Up to 325 p/L", yns: "Not detected", limit: "No limit" },
	{ name: "PFAS / PFOS", us: "Trace", yns: "Not detected", limit: "4.0 ng/L" },
	{ name: "Arsenic", us: "Trace", yns: "Not detected", limit: "10 µg/L" },
	{ name: "Lead", us: "Trace", yns: "Not detected", limit: "15 µg/L" },
];

export function TestResults() {
	return (
		<section className="bg-yns-cream">
			<div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 py-20 sm:py-28">
				<div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
					<div className="lg:col-span-5 lg:sticky lg:top-28">
						<p className="text-[11px] tracking-[0.22em] uppercase text-yns-green font-medium">
							Third-Party Verified
						</p>
						<h2 className="mt-4 font-display text-4xl sm:text-5xl text-yns-navy leading-[1.05]">
							The numbers, <span className="italic">unedited.</span>
						</h2>
						<p className="mt-6 text-foreground/75 text-[15px] leading-relaxed">
							We test every batch at an ISO-17025 accredited lab and publish the results in full. Compare us
							to the average U.S. municipal tap water below.
						</p>
						<div className="mt-8 flex items-center gap-4">
							<div className="text-[11px] tracking-[0.22em] uppercase text-foreground/60 font-medium">
								Certified by
							</div>
							<div className="flex items-center gap-3 font-display italic text-yns-green">
								<span>NSF</span>
								<span className="text-foreground/30">•</span>
								<span>Eurofins</span>
								<span className="text-foreground/30">•</span>
								<span>SCS</span>
							</div>
						</div>
						<div className="mt-10 relative aspect-[5/4] rounded-sm overflow-hidden hidden lg:block">
							<Image
								src="/scraped-2.jpg"
								alt="Misty alpine lake at dawn"
								fill
								sizes="(max-width: 1024px) 100vw, 40vw"
								className="object-cover"
							/>
						</div>
					</div>
					<div className="lg:col-span-7">
						<div className="rounded-sm border border-foreground/10 bg-background overflow-hidden">
							<div className="grid grid-cols-[1.5fr_1fr_1fr_1fr] text-[11px] tracking-[0.18em] uppercase font-medium text-foreground/60 px-6 py-4 border-b border-foreground/10 bg-background">
								<div>Contaminant</div>
								<div className="text-right">U.S. Avg</div>
								<div className="text-right text-yns-green">Your Next Store</div>
								<div className="text-right hidden sm:block">EPA Limit</div>
							</div>
							{rows.map((row, idx) => (
								<div
									key={row.name}
									className={`grid grid-cols-[1.5fr_1fr_1fr_1fr] px-6 py-5 text-[14px] ${idx % 2 === 1 ? "bg-yns-cream/40" : ""}`}
								>
									<div className="font-display text-yns-navy text-lg">{row.name}</div>
									<div className="text-right text-foreground/65 self-center">{row.us}</div>
									<div className="text-right text-yns-green font-medium self-center">{row.yns}</div>
									<div className="text-right text-foreground/50 self-center hidden sm:block">{row.limit}</div>
								</div>
							))}
						</div>
						<p className="mt-4 text-[12px] text-foreground/55">
							Last laboratory report &mdash; March 2026. Full reports available in PDF on request.
						</p>
					</div>
				</div>
			</div>
		</section>
	);
}
