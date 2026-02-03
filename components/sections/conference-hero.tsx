import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

export function ConferenceHero() {
	return (
		<>
			{/* Hero Header */}
			<header className="grid grid-cols-1 md:grid-cols-12 border-b border-foreground/10 min-h-[400px]">
				<div className="col-span-1 md:col-span-12 p-4 md:p-12 flex flex-col justify-center relative overflow-hidden">
					{/* Decorative Arrows */}
					<div className="absolute top-4 right-4 md:top-10 md:right-10 flex space-x-8 opacity-50">
						<ArrowUpRight className="w-6 h-6 -rotate-45" />
						<ArrowUpRight className="w-6 h-6 -rotate-45" />
						<ArrowUpRight className="w-6 h-6 -rotate-45" />
					</div>

					<p className="font-mono text-primary text-sm md:text-base mb-2 tracking-widest uppercase">
						Global Developer Conference
					</p>

					<h1 className="text-6xl md:text-8xl lg:text-9xl font-black uppercase leading-[0.85] tracking-tight">
						TECH
						<br />
						<span className="text-outline">SUMMIT</span>
						<br />
						2024
					</h1>

					{/* Decorative Star */}
					<div className="absolute right-4 bottom-4 md:right-20 md:bottom-10 animate-pulse text-primary">
						<svg
							className="w-24 h-24 md:w-40 md:h-40 rotate-12"
							fill="currentColor"
							viewBox="0 0 100 100"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path d="M50 0L58 35L95 25L65 50L95 75L58 65L50 100L42 65L5 75L35 50L5 25L42 35L50 0Z" />
						</svg>
					</div>
				</div>
			</header>

			{/* Description Banner */}
			<section className="grid grid-cols-1 md:grid-cols-12 border-b border-foreground/10 bg-secondary/50">
				<div className="col-span-1 md:col-span-8 p-6 md:p-8 border-b md:border-b-0 md:border-r border-foreground/10 flex flex-col justify-center">
					<p className="font-mono text-xs md:text-sm max-w-xl opacity-80 leading-relaxed">
						<span className="text-primary">{"//"}</span> All the movements of an outside world People moving
						in an inside world. Join 5000+ developers, designers, and creators for three days of
						future-forward talks.
					</p>
				</div>
				<div className="col-span-1 md:col-span-4 p-0 flex">
					<Link
						href="#tickets"
						className="flex-1 flex items-center justify-between px-8 py-6 bg-primary text-white hover:bg-foreground hover:text-background transition-all duration-300 group"
					>
						<span className="text-2xl font-bold uppercase tracking-wider">Find Tickets</span>
						<ArrowUpRight className="w-8 h-8 transform group-hover:rotate-45 transition-transform" />
					</Link>
				</div>
			</section>
		</>
	);
}
