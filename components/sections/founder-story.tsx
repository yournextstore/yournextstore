import Image from "next/image";

export function FounderStory() {
	return (
		<section
			className="relative bg-ink text-parchment overflow-hidden"
			style={{ backgroundColor: "#0e0d0b" }}
		>
			<div className="relative h-[70vh] min-h-[520px] w-full">
				<Image
					src="/scraped-3.jpg"
					alt="Coastal cliffs at sunrise"
					fill
					sizes="100vw"
					className="object-cover"
				/>
				<div
					className="absolute inset-0"
					style={{
						background:
							"linear-gradient(180deg, rgba(14,13,11,0.45) 0%, rgba(14,13,11,0.15) 35%, rgba(14,13,11,0.55) 80%, rgba(14,13,11,0.9) 100%)",
					}}
				/>
				<div className="absolute top-8 left-6 sm:left-10 font-mono text-[0.55rem] tracking-[0.3em] uppercase text-parchment/60">
					<div>Chapter 02</div>
					<div className="text-parchment/35">The origin coast — 41°22'N 8°45'W</div>
				</div>
			</div>

			<div className="-mt-32 sm:-mt-48 relative z-10 px-6 sm:px-10 lg:px-14 pb-24">
				<div className="max-w-3xl">
					<p className="eyebrow text-sand mb-6">A note from the founders</p>
					<blockquote className="font-serif text-3xl sm:text-4xl lg:text-5xl leading-[1.1] tracking-tight text-parchment/95">
						<span className="text-sand">“</span>We grew up on a coast where the water was colder than the air.
						The men we knew didn&apos;t talk about skin — they talked about{" "}
						<span className="italic">weather</span>, salt, and the season&apos;s work. Their faces told the
						story regardless. We built Your Next Store to give that face a quieter morning.
						<span className="text-sand">”</span>
					</blockquote>
					<div className="mt-10 grid sm:grid-cols-2 gap-10 max-w-2xl">
						<div>
							<p className="font-mono text-[0.6rem] tracking-[0.3em] uppercase text-sand">Mateo R.</p>
							<p className="font-mono text-[0.7rem] tracking-[0.18em] uppercase text-parchment/55 mt-1">
								Co-founder · Biology
							</p>
						</div>
						<div>
							<p className="font-mono text-[0.6rem] tracking-[0.3em] uppercase text-sand">Aurélien K.</p>
							<p className="font-mono text-[0.7rem] tracking-[0.18em] uppercase text-parchment/55 mt-1">
								Co-founder · Formulation
							</p>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
