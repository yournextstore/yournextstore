import Image from "next/image";

export function About() {
	return (
		<section id="about" className="relative bg-[color:var(--oxblood)] text-cream overflow-hidden">
			<div
				aria-hidden
				className="absolute inset-0 opacity-30 mix-blend-overlay"
				style={{
					backgroundImage:
						"url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='320' height='320'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/></filter><rect width='100%25' height='100%25' filter='url(%23n)' opacity='0.4'/></svg>\")",
				}}
			/>
			<div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
				<div className="lg:col-span-5 relative">
					<div className="relative aspect-[4/5] overflow-hidden rounded-sm shadow-2xl">
						<Image
							src="/scraped-4.jpg"
							alt="Atelier still life"
							fill
							sizes="(max-width: 1024px) 100vw, 40vw"
							className="object-cover"
						/>
						<div className="absolute inset-0 bg-gradient-to-tr from-[color:var(--oxblood)]/40 via-transparent to-transparent" />
					</div>
					<div className="absolute -bottom-6 -right-6 hidden md:block w-40 aspect-square overflow-hidden rounded-sm border-4 border-[color:var(--oxblood)] shadow-xl">
						<Image src="/scraped-2.jpg" alt="" fill sizes="160px" className="object-cover" />
					</div>
				</div>
				<div className="lg:col-span-7 lg:pl-6">
					<span className="eyebrow text-[color:var(--blush)]">— Our Story</span>
					<h2 className="mt-5 font-serif text-4xl sm:text-5xl lg:text-[56px] leading-[1.05] font-medium">
						Heirloom <span className="italic font-light">objects</span>, gathered slowly.
					</h2>
					<div className="mt-8 space-y-5 text-[15px] leading-relaxed text-cream/80 max-w-xl">
						<p>
							Each piece in our collection is the work of a hand that knows the material — kilns fired through
							the night, threads pulled taut on quiet looms, brass that holds the warmth of an afternoon sun.
						</p>
						<p>
							We partner with makers across small villages who share a quieter ethic: sustainable materials,
							patient process, and the kind of imperfection that proves a human was there.
						</p>
					</div>
					<dl className="mt-12 grid grid-cols-3 gap-6 max-w-md">
						{[
							{ k: "32+", v: "Artisans" },
							{ k: "14", v: "Countries" },
							{ k: "100%", v: "Handmade" },
						].map((s) => (
							<div key={s.v} className="border-l border-cream/30 pl-4">
								<dt className="font-serif text-3xl text-cream">{s.k}</dt>
								<dd className="mt-1 text-[11px] tracking-[0.2em] uppercase text-cream/60">{s.v}</dd>
							</div>
						))}
					</dl>
				</div>
			</div>
		</section>
	);
}
