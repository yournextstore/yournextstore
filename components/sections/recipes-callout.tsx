import Image from "next/image";
import { YnsLink } from "../yns-link";

export function RecipesCallout() {
	return (
		<section id="recipes" className="bg-[var(--candy)] text-white overflow-hidden relative">
			{/* Stripe overlay */}
			<div
				aria-hidden="true"
				className="absolute inset-0 opacity-[0.06] pointer-events-none"
				style={{
					backgroundImage: "repeating-linear-gradient(45deg, #fff 0 2px, transparent 2px 14px)",
				}}
			/>

			<div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24">
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
					<div>
						<p className="text-xs font-bold tracking-[0.3em] text-[var(--blush)] uppercase">
							RECIPES & RITUALS
						</p>
						<h2 className="mt-3 font-display italic text-5xl sm:text-6xl lg:text-7xl leading-[0.95] tracking-tight">
							A love letter,
							<br />
							baked at 350°.
						</h2>
						<p className="mt-6 text-lg text-white/90 max-w-md leading-relaxed">
							Free recipe cards in every order. Or grab our most-requested ones: brown butter chip, oat raisin
							(the good kind), and pink-iced hearts for the people you adore.
						</p>
						<div className="mt-10 flex flex-col sm:flex-row gap-3">
							<YnsLink
								href="#"
								className="inline-flex items-center justify-center h-12 px-8 rounded-full bg-white text-[var(--candy)] text-sm font-bold tracking-[0.18em] uppercase hover:bg-[var(--cream)] transition-colors"
							>
								Browse Recipes
							</YnsLink>
							<YnsLink
								href="/products"
								className="inline-flex items-center justify-center h-12 px-8 rounded-full border-2 border-white text-white text-sm font-bold tracking-[0.18em] uppercase hover:bg-white hover:text-[var(--candy)] transition-colors"
							>
								Or Skip & Shop
							</YnsLink>
						</div>
					</div>

					<div className="relative">
						<div className="relative aspect-square rounded-full overflow-hidden ring-8 ring-white/20 shadow-2xl">
							<Image
								src="/scraped-5.jpg"
								alt="Chocolate chip cookie broken in half"
								fill
								sizes="(max-width: 1024px) 100vw, 50vw"
								className="object-cover"
							/>
						</div>
						{/* floating chip badges */}
						<div className="absolute -top-3 -left-3 sm:-top-6 sm:-left-6 bg-[var(--cream)] text-[var(--maroon)] rounded-full px-4 py-2 text-xs font-bold tracking-[0.2em] shadow-lg rotate-[-6deg]">
							REAL BUTTER
						</div>
						<div className="absolute bottom-2 -right-2 sm:-bottom-4 sm:-right-4 bg-[var(--blush)] text-[var(--maroon)] rounded-full px-4 py-2 text-xs font-bold tracking-[0.2em] shadow-lg rotate-[8deg]">
							MELTY MIDDLES
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
