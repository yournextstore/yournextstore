import Image from "next/image";

const stats = [
	{
		value: "50%",
		label: "of US households could go solar with current rooftop space.",
		image: "/scraped-2.jpg",
	},
	{
		value: "25%",
		label: "less grid demand in neighborhoods with shared solar.",
		image: "/scraped-3.jpg",
	},
	{
		value: "30%",
		label: "drop in panel cost over the past five years alone.",
		image: "/scraped-4.jpg",
	},
	{
		value: "40%",
		label: "of new US power capacity in 2024 came from solar.",
		image: "/scraped-5.jpg",
	},
];

export function Impact() {
	return (
		<section className="bg-[var(--forest-deep)] text-white">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
				<div className="max-w-2xl mb-10">
					<p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--lime)] divider-leaf">
						By the numbers
					</p>
					<h2 className="mt-2 text-3xl sm:text-4xl font-semibold tracking-tight text-balance">
						Environmental Impact of Solar Energy
					</h2>
					<p className="mt-3 text-[15px] text-white/70 leading-relaxed">
						The shift is happening, and it's measurable. A snapshot of where solar stands today and how
						quickly it's becoming the new default.
					</p>
				</div>

				<div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
					{stats.map((s) => (
						<div
							key={s.value}
							className="group relative overflow-hidden rounded-3xl bg-[var(--forest)]/60 ring-1 ring-white/5 hover:ring-[var(--lime)]/40 transition"
						>
							<div className="relative aspect-[4/3]">
								<Image
									src={s.image}
									alt=""
									fill
									className="object-cover opacity-70 group-hover:opacity-90 group-hover:scale-105 transition duration-500"
									sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
								/>
								<div className="absolute inset-0 bg-gradient-to-t from-[var(--forest-deep)] via-[var(--forest-deep)]/30 to-transparent" />
								<div className="absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-[var(--lime)] text-[var(--forest-deep)] px-2.5 py-1 text-[11px] font-semibold">
									<span className="size-1.5 rounded-full bg-[var(--forest-deep)]" />
									Verified
								</div>
							</div>
							<div className="p-5">
								<div className="text-4xl sm:text-5xl font-semibold tracking-tight text-[var(--lime)]">
									{s.value}
								</div>
								<p className="mt-2 text-sm text-white/75 leading-relaxed">{s.label}</p>
							</div>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
