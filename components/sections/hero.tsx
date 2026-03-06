import Image from "next/image";
import { HeroTypography } from "./hero-typography";

// Decorative wavy lines SVG
function DecorativeWavyLines() {
	return (
		<div
			className="absolute left-0 top-1/3 -translate-y-1/2 w-32 h-24 sm:w-48 sm:h-32 opacity-60 dark:opacity-40 pointer-events-none z-0 animate-float"
			style={{ animationDelay: "0.5s" }}
		>
			<svg className="w-full h-full" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 200 100">
				<path d="M0 30 Q 30 60 60 30 T 120 30 T 180 30" className="text-primary" />
				<path d="M0 60 Q 30 90 60 60 T 120 60 T 180 60" className="text-primary" />
			</svg>
		</div>
	);
}

// Decorative cross shape SVG
function DecorativeCross() {
	return (
		<div className="absolute right-[5%] top-[15%] w-24 h-24 sm:w-32 sm:h-32 pointer-events-none opacity-60 dark:opacity-40 z-0 rotate-12 animate-pulse-slow">
			<svg
				className="w-full h-full"
				fill="none"
				stroke="currentColor"
				strokeWidth="1.5"
				viewBox="0 0 100 100"
			>
				<path
					d="M35 15 L65 15 L65 35 L85 35 L85 65 L65 65 L65 85 L35 85 L35 65 L15 65 L15 35 L35 35 Z"
					className="text-primary"
				/>
			</svg>
		</div>
	);
}

// Refresh badge with heart path
function RefreshBadge() {
	return (
		<div
			className="absolute -left-4 md:-left-24 top-0 md:top-12 flex flex-col items-center justify-center w-24 h-24 md:w-32 md:h-32 pointer-events-none z-10 animate-float"
			style={{ animationDuration: "7s" }}
		>
			<svg className="w-full h-full absolute top-0 left-0 text-muted-foreground" viewBox="0 0 100 100">
				<path
					d="M50 35 C 20 5 0 35 50 95 C 100 35 80 5 50 35"
					fill="none"
					stroke="currentColor"
					strokeDasharray="4 3"
					strokeWidth="0.8"
				/>
			</svg>
			<span className="text-[0.6rem] font-serif tracking-[0.2em] uppercase mt-2 text-muted-foreground">
				Refresh
			</span>
		</div>
	);
}

// Info pill with technology description
function InfoPill() {
	return (
		<div
			className="absolute -right-4 md:-right-24 bottom-10 md:bottom-20 w-48 h-24 border border-border rounded-[50%] flex items-center justify-center p-6 transform rotate-3 bg-background/40 backdrop-blur-sm z-50 animate-fade-in-delayed opacity-0"
			style={{ animationDelay: "0.8s" }}
		>
			<p className="text-[0.6rem] text-center font-serif leading-tight text-muted-foreground">
				Our technologies and equipment have made it possible to create high tech, safe products.
			</p>
		</div>
	);
}

// Hero images
function HeroImages() {
	return (
		<>
			{/* Left image - hands washing */}
			<div
				className="absolute left-6 bottom-32 md:left-24 md:bottom-48 w-40 h-40 md:w-56 md:h-56 z-30 opacity-0 animate-fade-in-delayed"
				style={{ animationDelay: "1.2s" }}
			>
				<Image
					alt="Hands washing"
					src="https://lh3.googleusercontent.com/aida-public/AB6AXuAOoqycicICblSoUBU599a7vovG4dwL1Ke4Z3-T3pUfJJ_3KccounONaPwsPog6SHtb9ojLgWMiFrKv8Qwsoj8haKJduuz_6NTOdXhFLpvoK3zgERDhy4o6yvuvcGvTXgfpjGw58wo2ICWs6kJbNNvRw0H6B3W2CaeTjJz3oHymZbd29MxhA2Nj7WNORydhLUP9be_bWiWn8eTZeBuYIYWbdSmAInbkNluvxvazz9gK4saA2IWvOLjvjcfUgw35gj6KIIJHq8xNFfGI"
					fill
					className="object-cover shadow-xl dark:shadow-black/60 ring-1 ring-white/20 dark:ring-white/10"
					sizes="(max-width: 768px) 160px, 224px"
				/>
			</div>

			{/* Right image - model with leaf */}
			<div
				className="absolute right-0 bottom-0 md:right-0 md:bottom-0 w-64 h-48 md:w-[28rem] md:h-[18rem] z-40 overflow-hidden opacity-0 animate-fade-in-delayed"
				style={{ animationDelay: "1.4s" }}
			>
				<Image
					alt="Model face behind large leaf"
					src="https://lh3.googleusercontent.com/aida-public/AB6AXuBQEkpui6fJgW9o7yR-T_4_9sZsxproCJ5njHANk8Xetb1UnG911H8Tv7MvIiUW8A-cDi9n-TCgFoczEcdogWXRX1SpH2pI8iQXDjOxbbwMiOLbBkI6TBMkPH3hEo7WWWkpI3oONwocSRebOE52Enu-dEtFTOfF8F1u0FB5Q7bMcBl5GMYlIZRtZDGr6sA8Q-wKp2zz24Ic6u5YEw3EDWEhOFP-q8nN0bgkGT_bdiKFGTR_D78zin_M9Vt586EGaAD7o7-veYWBogN0"
					fill
					className="object-cover object-top hover:scale-105 transition-transform duration-700"
					sizes="(max-width: 768px) 256px, 448px"
				/>
			</div>
		</>
	);
}

export function Hero() {
	return (
		<section className="relative w-full min-h-[calc(100vh-100px)] flex flex-col items-center justify-center py-10 md:py-0 overflow-hidden">
			{/* Decorative elements */}
			<DecorativeWavyLines />
			<DecorativeCross />

			{/* Main grid layout */}
			<div className="relative w-full max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-12 gap-8 h-full items-center">
				{/* Left spacer */}
				<div className="hidden md:block md:col-span-2 relative h-full" />

				{/* Center content */}
				<div className="col-span-1 md:col-span-8 relative text-center flex flex-col items-center justify-center z-20">
					{/* "nr 1" outline text */}
					<div className="absolute -top-16 left-4 md:-left-4 text-6xl md:text-7xl font-display text-stroke-1 opacity-100 dark:opacity-60 animate-float">
						nr 1
					</div>

					{/* Refresh badge */}
					<RefreshBadge />

					{/* Main typography */}
					<HeroTypography />

					{/* Info pill */}
					<InfoPill />
				</div>

				{/* Right spacer */}
				<div className="hidden md:block md:col-span-2" />
			</div>

			{/* Floating images */}
			<HeroImages />
		</section>
	);
}
