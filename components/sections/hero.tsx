import { ArrowUpRight, Camera, Facebook, Grid2X2, Music } from "lucide-react";
import { YnsLink } from "../yns-link";

export function Hero() {
	return (
		<section className="w-full max-w-[1600px] mx-auto px-4 md:px-6 py-6">
			<div className="bg-card rounded-3xl p-8 md:p-10 relative overflow-hidden shadow-soft flex flex-col md:flex-row items-center h-auto md:h-[480px]">
				{/* Decorative Elements */}
				<div className="absolute top-10 right-10 w-4 h-4 rounded-full bg-accent opacity-20 animate-pulse" />
				<div className="absolute bottom-20 left-1/2 w-6 h-6 rounded-full bg-primary opacity-20" />

				{/* Left Content */}
				<div className="relative z-10 w-full md:w-1/2 flex flex-col justify-between h-full space-y-8 md:space-y-0">
					<div>
						{/* Badge */}
						<span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary text-xs font-semibold text-muted-foreground mb-4">
							<Grid2X2 className="w-3 h-3" /> Aura Premium Series
						</span>

						{/* Music-Style Scrolling Title */}
						<div className="mb-2 space-y-1">
							{/* Line 1 - Scrolling Right to Left */}
							<div className="overflow-hidden">
								<div className="animate-text-scroll">
									<span className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground">
										Elevate Your&nbsp;&nbsp;&nbsp;•&nbsp;&nbsp;&nbsp;Elevate
										Your&nbsp;&nbsp;&nbsp;•&nbsp;&nbsp;&nbsp;
									</span>
									<span className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground">
										Elevate Your&nbsp;&nbsp;&nbsp;•&nbsp;&nbsp;&nbsp;Elevate
										Your&nbsp;&nbsp;&nbsp;•&nbsp;&nbsp;&nbsp;
									</span>
								</div>
							</div>
							{/* Line 2 - Scrolling Left to Right */}
							<div className="overflow-hidden">
								<div className="animate-text-scroll-reverse">
									<span className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary">
										Sound.&nbsp;&nbsp;&nbsp;◆&nbsp;&nbsp;&nbsp;Sound.&nbsp;&nbsp;&nbsp;◆&nbsp;&nbsp;&nbsp;
									</span>
									<span className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary">
										Sound.&nbsp;&nbsp;&nbsp;◆&nbsp;&nbsp;&nbsp;Sound.&nbsp;&nbsp;&nbsp;◆&nbsp;&nbsp;&nbsp;
									</span>
								</div>
							</div>
						</div>

						{/* Feature Highlight */}
						<div className="flex items-start gap-4 mt-6">
							<span className="text-6xl font-extrabold text-secondary select-none">01</span>
							<div className="max-w-[200px]">
								<h4 className="font-bold text-sm mb-1">Clear Sounds</h4>
								<p className="text-xs text-muted-foreground">
									Making your dream music come true with Aura Acoustics.
								</p>
							</div>
						</div>
					</div>

					{/* CTA Button */}
					<div>
						<YnsLink
							prefetch={"eager"}
							href="#products"
							className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-6 py-3 rounded-full inline-flex items-center gap-2 transition-transform hover:scale-105 shadow-glow"
						>
							Shop Now
							<span className="bg-primary-foreground text-primary rounded-full p-0.5">
								<ArrowUpRight className="w-4 h-4 -rotate-0" />
							</span>
						</YnsLink>
					</div>

					{/* Social Icons */}
					<div className="flex gap-4 mt-8 md:mt-0 text-muted-foreground">
						<span className="bg-secondary p-2 rounded-full hover:bg-secondary/80 cursor-pointer transition-colors">
							<Facebook className="w-4 h-4" />
						</span>
						<span className="bg-secondary p-2 rounded-full hover:bg-secondary/80 cursor-pointer transition-colors">
							<Music className="w-4 h-4" />
						</span>
						<span className="bg-secondary p-2 rounded-full hover:bg-secondary/80 cursor-pointer transition-colors">
							<Camera className="w-4 h-4" />
						</span>
					</div>
				</div>

				{/* Right Image Section */}
				<div className="relative w-full md:w-1/2 h-64 md:h-full flex items-center justify-center">
					{/* Decorative Circles - Animated */}
					<div className="absolute w-[300px] h-[300px] md:w-[400px] md:h-[400px] border border-border rounded-full animate-spin-slow" />
					<div className="absolute w-[250px] h-[250px] md:w-[320px] md:h-[320px] border border-border rounded-full animate-spin-slow-reverse" />

					{/* Hero Image Placeholder - Animated gradient orb */}
					<div className="relative z-20 w-48 h-48 md:w-64 md:h-64 bg-gradient-to-br from-accent/20 via-primary/20 to-secondary rounded-full flex items-center justify-center animate-float">
						<div className="w-32 h-32 md:w-44 md:h-44 bg-gradient-to-br from-accent/40 to-primary/40 rounded-full flex items-center justify-center backdrop-blur-sm animate-pulse-glow">
							<span className="text-4xl md:text-6xl font-bold text-foreground/20">A</span>
						</div>
					</div>

					{/* Navigation Controls */}
					<div className="absolute bottom-10 bg-card shadow-lg rounded-full p-2 flex items-center gap-2 z-30">
						<button
							type="button"
							className="w-8 h-8 rounded-full hover:bg-secondary flex items-center justify-center transition-colors"
						>
							<ArrowUpRight className="w-4 h-4 rotate-[225deg]" />
						</button>
						<button
							type="button"
							className="w-8 h-8 rounded-full hover:bg-secondary flex items-center justify-center transition-colors"
						>
							<ArrowUpRight className="w-4 h-4 rotate-45" />
						</button>
					</div>
				</div>
			</div>
		</section>
	);
}
