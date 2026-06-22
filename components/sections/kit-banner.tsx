import Image from "next/image";
import { YnsLink } from "../yns-link";

export function KitBanner() {
	return (
		<section className="relative bg-background">
			<div className="px-4 sm:px-8 lg:px-12 py-16 sm:py-20">
				<div className="relative overflow-hidden bg-foreground text-background">
					{/* subtle grain */}
					<div aria-hidden="true" className="absolute inset-0 yns-grain opacity-30 mix-blend-overlay" />

					{/* neon flood */}
					<div
						aria-hidden="true"
						className="absolute -right-32 -top-32 size-[480px] rounded-full"
						style={{
							background: "radial-gradient(closest-side, rgba(214,242,58,0.55), transparent 70%)",
						}}
					/>
					<div
						aria-hidden="true"
						className="absolute -left-24 -bottom-32 size-[420px] rounded-full"
						style={{
							background: "radial-gradient(closest-side, rgba(214,242,58,0.18), transparent 70%)",
						}}
					/>

					<div className="relative grid lg:grid-cols-12 gap-8 lg:gap-12 items-center p-10 sm:p-14 lg:p-20">
						<div className="lg:col-span-7">
							<p className="uppercase-display text-[10.5px] tracking-[0.28em] text-[#D6F23A]">
								Limited Edition · No. 04
							</p>
							<h2 className="mt-5 uppercase-display text-4xl sm:text-5xl lg:text-7xl leading-[0.95] tracking-tight">
								The Travel
								<br />
								<span className="text-[#D6F23A]">Ritual Kit</span>
							</h2>
							<p className="mt-6 max-w-md text-background/70 leading-relaxed">
								Four travel-sized essentials in our signature neon zip pouch. Cleanse, hydrate, defend and
								renew — anywhere the day takes you.
							</p>

							<ul className="mt-8 space-y-2.5">
								{[
									"Gentle Gel Facial Cleanse · 30ml",
									"Polyphenol Antioxidant Serum · 15ml",
									"Hydra+ Repair Cream · 30ml",
									"Mineral Defense SPF · 15ml",
								].map((item) => (
									<li key={item} className="flex items-center gap-3 text-sm text-background/85">
										<span className="size-1 rounded-full bg-[#D6F23A]" />
										{item}
									</li>
								))}
							</ul>

							<div className="mt-10 flex flex-col sm:flex-row gap-3">
								<YnsLink
									prefetch={"eager"}
									href="/products"
									className="inline-flex h-11 items-center justify-center px-7 bg-[#D6F23A] text-foreground uppercase-display text-[11px] tracking-[0.22em] hover:bg-[#E5FF55] transition-colors"
								>
									Shop the kit · $70
								</YnsLink>
								<YnsLink
									prefetch={"eager"}
									href="/products"
									className="inline-flex h-11 items-center justify-center px-7 border border-background/40 text-background uppercase-display text-[11px] tracking-[0.22em] hover:bg-background/5 transition-colors"
								>
									Build your own
								</YnsLink>
							</div>
						</div>

						<div className="lg:col-span-5 relative">
							<div className="relative aspect-[5/6] overflow-hidden">
								<Image
									src="/scraped-0.jpg"
									alt="Travel ritual kit"
									fill
									sizes="(max-width: 1024px) 100vw, 40vw"
									className="object-cover"
								/>
								<div className="absolute top-4 left-4 uppercase-display text-[10px] tracking-[0.2em] bg-background/95 text-foreground px-2.5 py-1">
									New · No. 04
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
