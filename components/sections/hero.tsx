import { ArrowRightIcon, Sparkles, Star, Heart } from "lucide-react";
import { YnsLink } from "../yns-link";
import { FloatingShapesBackground } from "../three/floating-shapes";

export function Hero() {
	return (
		<section className="relative overflow-hidden min-h-[80vh] flex items-center bg-gradient-to-br from-[oklch(0.95_0.06_330)] via-[oklch(0.96_0.04_200)] to-[oklch(0.97_0.05_90)]">
			<FloatingShapesBackground />

			{/* Decorative elements */}
			<div className="absolute top-10 left-10 animate-bounce-slow animation-delay-100">
				<Star className="h-8 w-8 text-primary fill-primary" />
			</div>
			<div className="absolute top-20 right-20 animate-float animation-delay-300">
				<Heart className="h-10 w-10 text-pink-400 fill-pink-400" />
			</div>
			<div className="absolute bottom-20 left-20 animate-wiggle animation-delay-200">
				<Sparkles className="h-12 w-12 text-yellow-400" />
			</div>
			<div className="absolute bottom-10 right-10 animate-bounce-slow animation-delay-400">
				<Star className="h-6 w-6 text-cyan-400 fill-cyan-400" />
			</div>

			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
				<div className="py-16 sm:py-20 lg:py-28">
					<div className="max-w-3xl text-center mx-auto">
						<div className="animate-pop-in">
							<span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6 animate-sparkle">
								<Sparkles className="h-4 w-4" />
								Welcome to the Fun Zone!
								<Sparkles className="h-4 w-4" />
							</span>
						</div>

						<h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight animate-slide-up">
							<span className="gradient-text">Amazing Stuff</span>
							<br />
							<span className="text-foreground">for Amazing Kids!</span>
						</h1>

						<p className="mt-8 text-xl sm:text-2xl text-muted-foreground leading-relaxed animate-slide-up animation-delay-200">
							Discover super cool toys, games, and awesome goodies that will make every day an adventure!
						</p>

						<div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center animate-slide-up animation-delay-300">
							<YnsLink
								prefetch={"eager"}
								href="#products"
								className="group inline-flex items-center justify-center gap-3 h-14 px-10 bg-primary text-primary-foreground rounded-full text-lg font-bold shadow-lg shadow-primary/30 hover:scale-105 hover:shadow-xl hover:shadow-primary/40 transition-all duration-300"
							>
								<span>Start Exploring</span>
								<ArrowRightIcon className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
							</YnsLink>
							<YnsLink
								prefetch={"eager"}
								href="#about"
								className="inline-flex items-center justify-center gap-2 h-14 px-10 bg-white/80 backdrop-blur-sm border-2 border-primary/20 rounded-full text-lg font-bold text-foreground hover:bg-white hover:border-primary/40 hover:scale-105 transition-all duration-300"
							>
								<Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
								Learn More
							</YnsLink>
						</div>

						{/* Fun stats */}
						<div className="mt-16 grid grid-cols-3 gap-8 animate-slide-up animation-delay-400">
							<div className="text-center">
								<div className="text-3xl sm:text-4xl font-black text-primary">500+</div>
								<div className="text-sm text-muted-foreground font-medium mt-1">Cool Products</div>
							</div>
							<div className="text-center">
								<div className="text-3xl sm:text-4xl font-black text-cyan-500">10K+</div>
								<div className="text-sm text-muted-foreground font-medium mt-1">Happy Kids</div>
							</div>
							<div className="text-center">
								<div className="text-3xl sm:text-4xl font-black text-yellow-500">5</div>
								<div className="text-sm text-muted-foreground font-medium mt-1">Star Rating</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Bottom wave decoration */}
			<div className="absolute bottom-0 left-0 right-0">
				<svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
					<path
						d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
						fill="var(--background)"
					/>
				</svg>
			</div>
		</section>
	);
}
