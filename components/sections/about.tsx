import Image from "next/image";
import { YnsLink } from "@/components/yns-link";

export function About() {
	return (
		<section id="about" className="bg-background">
			{/* Full-bleed lifestyle imagery row peeking at the bottom — strip of pastel stages */}
			<div className="relative grid grid-cols-2 sm:grid-cols-4 h-40 sm:h-56 lg:h-64 overflow-hidden">
				<div className="relative muse-blur-stage-lilac">
					<Image
						src="/scraped-0.jpg"
						alt=""
						fill
						sizes="(max-width: 640px) 50vw, 25vw"
						className="object-cover opacity-90 mix-blend-multiply"
					/>
				</div>
				<div className="relative muse-blur-stage-sage">
					<Image
						src="/scraped-3.jpg"
						alt=""
						fill
						sizes="(max-width: 640px) 50vw, 25vw"
						className="object-cover opacity-90 mix-blend-multiply"
					/>
				</div>
				<div className="relative muse-blur-stage-terracotta hidden sm:block">
					<Image
						src="/scraped-4.jpg"
						alt=""
						fill
						sizes="25vw"
						className="object-cover opacity-90 mix-blend-multiply"
					/>
				</div>
				<div className="relative muse-blur-stage-mint hidden sm:block">
					<Image
						src="/scraped-5.jpg"
						alt=""
						fill
						sizes="25vw"
						className="object-cover opacity-90 mix-blend-multiply"
					/>
				</div>
				<div
					aria-hidden="true"
					className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-b from-transparent to-background"
				/>
			</div>

			{/* Ingredient & ritual story */}
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
				<div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-center">
					<div className="lg:col-span-6 relative aspect-[5/6] overflow-hidden muse-blur-stage-lilac">
						<Image
							src="/scraped-1.jpg"
							alt="A close ritual"
							fill
							sizes="(max-width: 1024px) 100vw, 50vw"
							className="object-cover mix-blend-multiply opacity-95"
						/>
					</div>
					<div className="lg:col-span-6">
						<p className="text-[11px] uppercase tracking-[0.32em] text-foreground/55">
							Made for the everyday
						</p>
						<h2 className="mt-4 font-serif text-4xl sm:text-5xl lg:text-6xl font-light leading-[1.05] tracking-tight text-foreground">
							A laundry ritual,
							<br />
							<span className="italic">not a chore.</span>
						</h2>
						<p className="mt-6 text-[15px] leading-[1.7] text-foreground/70 max-w-md">
							Pressed from plant-derived enzymes and biodegradable surfactants, each pre-portioned sheet
							dissolves cleanly — no jugs, no pods, no plastic. A quiet act of care, repeated.
						</p>
						<dl className="mt-8 grid grid-cols-3 gap-6 max-w-md">
							<div>
								<dt className="font-serif text-3xl text-foreground">96%</dt>
								<dd className="mt-1 text-[11px] uppercase tracking-[0.22em] text-foreground/55">
									Plant-derived
								</dd>
							</div>
							<div>
								<dt className="font-serif text-3xl text-foreground">0g</dt>
								<dd className="mt-1 text-[11px] uppercase tracking-[0.22em] text-foreground/55">
									Plastic per load
								</dd>
							</div>
							<div>
								<dt className="font-serif text-3xl text-foreground">64</dt>
								<dd className="mt-1 text-[11px] uppercase tracking-[0.22em] text-foreground/55">
									Loads per box
								</dd>
							</div>
						</dl>
						<YnsLink
							prefetch={"eager"}
							href="/products"
							className="mt-10 inline-flex items-center gap-2 text-[12px] uppercase tracking-[0.28em] text-foreground border-b border-foreground/30 pb-1 hover:border-foreground transition-colors"
						>
							Read the formula
						</YnsLink>
					</div>
				</div>
			</div>
		</section>
	);
}
