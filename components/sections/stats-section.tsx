import { ArrowUpRight } from "lucide-react";
import { YnsLink } from "../yns-link";

export function StatsSection() {
	return (
		<section className="w-full max-w-[1600px] mx-auto px-4 md:px-6 py-8">
			<div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
				{/* Popular Colors Card */}
				<div className="lg:col-span-4 bg-card rounded-3xl p-6 shadow-soft">
					<h3 className="font-bold mb-6 text-lg">Popular Colors</h3>
					<div className="flex justify-between items-center">
						{[
							{ color: "bg-blue-500", ring: "ring-blue-500" },
							{ color: "bg-orange-400", ring: "ring-orange-400" },
							{ color: "bg-green-500", ring: "ring-green-500" },
							{ color: "bg-red-500", ring: "ring-red-500" },
							{ color: "bg-cyan-400", ring: "ring-cyan-400" },
						].map((item, index) => (
							<button
								key={item.color}
								type="button"
								className={`w-10 h-10 rounded-full ${item.color} shadow-md ${
									index === 0 ? `ring-2 ring-offset-2 ${item.ring}` : ""
								} hover:ring-2 hover:ring-offset-2 hover:${item.ring} transition-all hover:scale-110`}
								aria-label={`Select ${item.color} color`}
							/>
						))}
					</div>
				</div>

				{/* New Gen X-Bud Card */}
				<div className="lg:col-span-4 bg-card rounded-3xl p-6 shadow-soft relative overflow-hidden min-h-[220px] group">
					<div className="relative z-10 w-2/3">
						<h3 className="font-bold text-xl leading-tight mb-2">
							New Gen <br /> X-Bud
						</h3>
					</div>
					<YnsLink
						prefetch={"eager"}
						href="#products"
						className="absolute bottom-6 left-6 w-10 h-10 bg-card rounded-full flex items-center justify-center shadow-md z-10 transition-colors hover:bg-secondary"
					>
						<ArrowUpRight className="w-4 h-4" />
					</YnsLink>
					<div className="absolute top-1/2 right-[-20px] transform -translate-y-1/2 w-40 h-40 bg-gradient-to-br from-primary/30 to-accent/30 rounded-xl group-hover:scale-105 transition-transform duration-500" />
				</div>

				{/* VR Headset Card */}
				<div className="lg:col-span-4 bg-gradient-to-b from-secondary to-card rounded-3xl p-0 shadow-soft relative overflow-hidden group min-h-[300px]">
					<div className="absolute top-6 right-6 z-20">
						<YnsLink
							prefetch={"eager"}
							href="#products"
							className="w-10 h-10 bg-card rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-transform"
						>
							<ArrowUpRight className="w-4 h-4" />
						</YnsLink>
					</div>

					{/* Gradient placeholder for headset image */}
					<div className="absolute top-10 left-1/2 transform -translate-x-1/2 w-48 h-48 bg-gradient-to-br from-accent/40 via-primary/30 to-secondary rounded-full z-10 group-hover:scale-105 transition-transform duration-500" />

					<div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-card via-card/80 to-transparent z-20">
						<h3 className="font-bold text-lg mb-1">
							Light Grey Surface <br />
							Headphone
						</h3>
						<p className="text-sm text-muted-foreground">Boosted with bass</p>
					</div>
				</div>
			</div>
		</section>
	);
}
