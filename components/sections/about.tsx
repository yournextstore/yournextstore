import Image from "next/image";
import { YnsLink } from "@/components/yns-link";

export function About() {
	return (
		<section id="about" className="relative overflow-hidden bg-luxe-frame text-luxe-cream">
			<div
				aria-hidden
				className="absolute -top-32 right-0 h-[420px] w-[420px] rounded-full opacity-50 blur-3xl"
				style={{
					background:
						"radial-gradient(closest-side, rgba(240,184,200,0.6), rgba(123,91,214,0.2) 60%, transparent)",
				}}
			/>
			<div
				aria-hidden
				className="absolute -bottom-32 left-0 h-[480px] w-[480px] rounded-full opacity-60 blur-3xl"
				style={{
					background:
						"radial-gradient(closest-side, rgba(123,91,214,0.6), rgba(201,167,232,0.2) 60%, transparent)",
				}}
			/>

			<div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
				<div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
					<div>
						<p className="text-xs uppercase tracking-[0.3em] text-[color:var(--color-luxe-lilac)]">
							The Maison
						</p>
						<h2 className="mt-3 font-display text-5xl sm:text-6xl lg:text-7xl leading-[0.95] text-white">
							An olfactory
							<br />
							journey, bottled.
						</h2>
						<p className="mt-6 max-w-lg text-base leading-relaxed text-[color:var(--color-luxe-cream)]/80">
							Every Your Next Store fragrance is a chapter — composed by master perfumers in Grasse, finished
							by hand, and poured into iridescent crystal. Discover scents that linger long after the room is
							empty.
						</p>

						<div className="mt-10 grid grid-cols-3 gap-6">
							{[
								{ k: "12+", v: "Years of craft" },
								{ k: "84", v: "Signature accords" },
								{ k: "42", v: "Boutiques worldwide" },
							].map((stat) => (
								<div key={stat.v}>
									<p className="font-display text-3xl sm:text-4xl text-white">{stat.k}</p>
									<p className="mt-1 text-xs uppercase tracking-widest text-[color:var(--color-luxe-cream)]/60">
										{stat.v}
									</p>
								</div>
							))}
						</div>

						<div className="mt-10 flex flex-wrap gap-3">
							<YnsLink
								prefetch={"eager"}
								href="/products"
								className="inline-flex h-12 items-center gap-2 rounded-full bg-[color:var(--color-luxe-cream)] px-6 text-sm font-semibold text-[color:var(--color-luxe-midnight)] transition-transform hover:scale-[1.02]"
							>
								Discover the maison
							</YnsLink>
							<YnsLink
								prefetch={"eager"}
								href="#products"
								className="inline-flex h-12 items-center gap-2 rounded-full border border-white/30 px-6 text-sm font-semibold text-white hover:bg-white/10"
							>
								Read the journal
							</YnsLink>
						</div>
					</div>

					<div className="relative">
						<div className="grid grid-cols-2 gap-4">
							<div className="relative aspect-[3/4] overflow-hidden rounded-3xl bg-white/10">
								<Image
									src="/scraped-0.jpg"
									alt="Maison atelier"
									fill
									sizes="(max-width: 1024px) 50vw, 25vw"
									className="object-cover"
								/>
								<div className="absolute inset-0 bg-gradient-to-t from-[color:var(--color-luxe-midnight)]/60 via-transparent to-transparent" />
							</div>
							<div className="relative mt-10 aspect-[3/4] overflow-hidden rounded-3xl bg-white/10">
								<Image
									src="/scraped-1.jpg"
									alt="Bottle craftsmanship"
									fill
									sizes="(max-width: 1024px) 50vw, 25vw"
									className="object-cover"
								/>
								<div className="absolute inset-0 bg-gradient-to-t from-[color:var(--color-luxe-midnight)]/60 via-transparent to-transparent" />
							</div>
						</div>
						<div className="luxe-glass absolute -bottom-6 left-1/2 hidden -translate-x-1/2 rounded-2xl px-5 py-3 lg:block">
							<p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Featured Note</p>
							<p className="mt-1 font-display text-2xl text-foreground">Iris & Ambergris</p>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
