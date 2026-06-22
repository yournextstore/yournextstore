import Image from "next/image";
import { YnsLink } from "../yns-link";

export function About() {
	return (
		<section id="about" className="bg-background">
			<div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-10 px-6 pb-16 lg:grid-cols-12 lg:gap-12 lg:px-12">
				<div className="relative col-span-1 overflow-hidden bg-lilac-soft lg:col-span-7">
					<div className="relative aspect-[16/10] w-full">
						<Image
							src="/scraped-2.jpg"
							alt="The YNS atelier"
							fill
							sizes="(max-width: 1024px) 100vw, 60vw"
							className="object-cover"
						/>
						<div className="absolute inset-0 bg-linear-to-tr from-foreground/30 via-transparent to-transparent" />
					</div>
					<div className="absolute bottom-6 left-6 max-w-md text-background">
						<p className="text-[11px] uppercase tracking-[0.28em]">The Atelier</p>
						<h3 className="font-display mt-2 text-3xl leading-tight tracking-[-0.01em]">
							Pieces chosen for the way you actually dress
						</h3>
					</div>
				</div>
				<div className="col-span-1 flex flex-col justify-between gap-8 lg:col-span-5">
					<div>
						<p className="text-[11px] uppercase tracking-[0.28em] text-lilac-deep">Our Story</p>
						<h2 className="font-display mt-3 text-4xl font-medium leading-[1.05] tracking-[-0.015em] text-foreground sm:text-5xl">
							A quiet kind of <span className="italic text-lilac-deep">luxury</span>.
						</h2>
						<p className="mt-6 text-base leading-relaxed text-muted-foreground">
							Your Next Store is a destination for women who collect rather than chase. We work directly with
							European houses and emerging designers to bring you considered pieces — the silk blouse that
							lasts a decade, the trouser that tailors to memory.
						</p>
						<p className="mt-4 text-base leading-relaxed text-muted-foreground">
							Every garment is buyer-approved, photographed in our own studio, and shipped from our atelier in
							Antwerp.
						</p>
					</div>
					<div className="grid grid-cols-3 gap-6 border-t border-border pt-8">
						<div>
							<p className="font-display text-3xl font-medium text-foreground">120+</p>
							<p className="mt-1 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
								Designer Houses
							</p>
						</div>
						<div>
							<p className="font-display text-3xl font-medium text-foreground">48h</p>
							<p className="mt-1 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
								Express to Europe
							</p>
						</div>
						<div>
							<p className="font-display text-3xl font-medium text-foreground">30d</p>
							<p className="mt-1 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
								Effortless Returns
							</p>
						</div>
					</div>
					<YnsLink
						prefetch={"eager"}
						href="/products"
						className="inline-flex w-fit items-center gap-2 border-b border-foreground pb-1 text-[11px] uppercase tracking-[0.22em] text-foreground hover:text-lilac-deep transition-colors"
					>
						Discover the edit
					</YnsLink>
				</div>
			</div>
		</section>
	);
}
