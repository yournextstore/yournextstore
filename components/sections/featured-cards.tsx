import { ArrowUpRight, Flame, Heart } from "lucide-react";
import { YnsLink } from "../yns-link";

export function FeaturedCards() {
	return (
		<section className="w-full max-w-[1600px] mx-auto px-4 md:px-6 py-8">
			<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
				{/* More Products Card */}
				<div className="bg-card rounded-3xl p-6 shadow-soft flex flex-col justify-between group">
					<div className="flex justify-between items-start mb-4">
						<div>
							<h3 className="font-bold text-lg">More Products</h3>
							<p className="text-sm text-muted-foreground">460+ items</p>
						</div>
						<button
							type="button"
							className="text-pink-500 hover:scale-110 transition-transform"
							aria-label="Add to wishlist"
						>
							<Heart className="w-6 h-6" fill="currentColor" />
						</button>
					</div>
					<div className="flex justify-between items-center gap-2">
						{[1, 2, 3].map((i) => (
							<div key={i} className="bg-secondary rounded-xl p-2 w-16 h-16 flex items-center justify-center">
								<div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg" />
							</div>
						))}
					</div>
				</div>

				{/* Stats Card */}
				<div className="bg-card rounded-3xl p-6 shadow-soft flex flex-col items-center justify-center text-center">
					<div className="flex -space-x-3 mb-3">
						{[1, 2, 3].map((i) => (
							<div
								key={i}
								className="w-10 h-10 rounded-full border-2 border-card bg-gradient-to-br from-primary/40 to-accent/40"
							/>
						))}
					</div>
					<div className="bg-accent text-accent-foreground rounded-full w-24 h-24 flex flex-col items-center justify-center mb-2 shadow-lg">
						<span className="font-bold text-xl">5m+</span>
						<span className="text-[10px] opacity-90">Downloads</span>
					</div>
					<div className="flex items-center gap-1 text-sm font-semibold">
						<span className="text-yellow-400">★</span>
						4.6 Reviews
					</div>
				</div>

				{/* Popular Card */}
				<div className="bg-card rounded-3xl p-5 shadow-soft relative overflow-hidden group">
					<div className="absolute top-4 left-4 z-10">
						<span className="bg-card/80 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
							<Flame className="w-3 h-3 text-red-500" />
							Popular
						</span>
					</div>
					<YnsLink
						prefetch={"eager"}
						href="#products"
						className="absolute top-4 right-4 z-10 bg-card rounded-full w-8 h-8 flex items-center justify-center shadow-sm cursor-pointer hover:bg-secondary transition-colors"
					>
						<ArrowUpRight className="w-4 h-4" />
					</YnsLink>
					<div className="mt-10 mb-4 z-10 relative">
						<h3 className="font-bold leading-tight text-lg">
							Listening Has <br />
							Been Released
						</h3>
					</div>
					<div className="flex gap-2 relative z-10">
						{[1, 2].map((i) => (
							<div
								key={i}
								className={`w-10 h-10 rounded-full overflow-hidden border-2 border-card bg-gradient-to-br from-accent/40 to-primary/40 ${i === 2 ? "-ml-4" : ""}`}
							/>
						))}
					</div>
					<div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-primary/20 to-transparent rounded-tl-3xl" />
					<span className="absolute bottom-4 right-4 bg-card px-2 py-0.5 rounded text-xs font-bold shadow-sm flex items-center z-10">
						<span className="text-yellow-400 mr-1">★</span> 4.7
					</span>
				</div>
			</div>
		</section>
	);
}
