import Image from "next/image";
import { YnsLink } from "../yns-link";

const FLOATING_CAPSULES = [
	{ className: "left-[6%] top-[18%] w-[180px] h-[64px] jam-anim-a opacity-90", rotate: "-12deg" },
	{ className: "right-[8%] top-[12%] w-[220px] h-[78px] jam-anim-b opacity-95", rotate: "18deg" },
	{ className: "left-[3%] top-[58%] w-[160px] h-[58px] jam-anim-c opacity-85", rotate: "-22deg" },
	{ className: "right-[5%] top-[60%] w-[200px] h-[70px] jam-anim-a opacity-90", rotate: "12deg" },
];

const FLOATING_BERRIES = [
	{ src: "/scraped-0.jpg", className: "left-[18%] top-[12%] w-20 h-20 jam-anim-b" },
	{ src: "/scraped-1.jpg", className: "right-[20%] top-[22%] w-16 h-16 jam-anim-a" },
	{ src: "/scraped-2.jpg", className: "left-[12%] top-[55%] w-14 h-14 jam-anim-c" },
	{ src: "/scraped-3.jpg", className: "right-[18%] top-[58%] w-20 h-20 jam-anim-b" },
];

export function Hero() {
	return (
		<section className="relative overflow-hidden jam-hero-bg text-white isolate">
			<div className="absolute inset-0 jam-noise opacity-30 pointer-events-none" aria-hidden />

			{/* Floating capsule shapes */}
			{FLOATING_CAPSULES.map((capsule, i) => (
				<div
					key={`capsule-${i}`}
					aria-hidden
					className={`pointer-events-none absolute jam-capsule ${capsule.className}`}
					style={{ transform: `rotate(${capsule.rotate})` }}
				/>
			))}

			{/* Floating berries */}
			{FLOATING_BERRIES.map((berry, i) => (
				<div
					key={`berry-${i}`}
					aria-hidden
					className={`pointer-events-none absolute ${berry.className} blur-[0.5px]`}
				>
					<Image
						src={berry.src}
						alt=""
						fill
						sizes="80px"
						className="object-contain drop-shadow-[0_15px_25px_rgba(0,0,0,0.35)]"
					/>
				</div>
			))}

			<div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16 pb-24 sm:pb-32">
				{/* Retailer line */}
				<div className="flex items-center justify-center gap-3 mb-6 text-[11px] sm:text-xs font-bold uppercase tracking-[0.25em]">
					<span>Now Available At</span>
					<span className="inline-flex items-center gap-1.5">
						<span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-white text-[#c8132b] text-[10px] font-black">
							◎
						</span>
						Target
					</span>
					<span className="opacity-50">·</span>
					<span className="inline-flex items-center gap-1.5">
						<span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#ffc220] text-[#0071ce] text-[10px] font-black">
							✦
						</span>
						Walmart
					</span>
				</div>

				{/* Headline */}
				<div className="text-center">
					<h1 className="font-display uppercase leading-[0.85] tracking-tighter text-white drop-shadow-[0_20px_30px_rgba(0,0,0,0.25)]">
						<span className="block text-4xl sm:text-6xl lg:text-7xl xl:text-8xl">Simple Recipe</span>
						<span className="block text-7xl sm:text-9xl lg:text-[11rem] xl:text-[14rem] mt-1 sm:mt-2">
							PB&amp;J
						</span>
					</h1>
				</div>

				{/* Product boxes (decorative duo) */}
				<div className="relative mt-[-3rem] sm:mt-[-5rem] lg:mt-[-7rem] flex items-center justify-center min-h-[280px] sm:min-h-[420px]">
					<div className="relative w-full max-w-3xl h-[280px] sm:h-[420px]">
						<JamBox className="absolute left-[8%] top-0 w-[42%] sm:w-[40%] -rotate-12 z-10" flavor="berry" />
						<JamBox
							className="absolute right-[8%] top-8 w-[42%] sm:w-[40%] rotate-12 z-20"
							flavor="strawberry"
						/>

						{/* Flavor toggle pill */}
						<div className="absolute left-1/2 -translate-x-1/2 bottom-[10%] z-30 inline-flex items-center gap-1 rounded-full bg-white/95 p-1 shadow-[0_15px_45px_rgba(0,0,0,0.35)] backdrop-blur">
							<button
								type="button"
								className="px-4 sm:px-6 py-2 rounded-full bg-[#1a0810] text-white text-[10px] sm:text-xs font-bold uppercase tracking-widest"
							>
								Strawberry
							</button>
							<button
								type="button"
								className="px-4 sm:px-6 py-2 rounded-full text-[#1a0810] text-[10px] sm:text-xs font-bold uppercase tracking-widest"
							>
								Berry
							</button>
						</div>
					</div>
				</div>

				{/* CTAs */}
				<div className="mt-10 flex flex-wrap items-center justify-center gap-3">
					<YnsLink
						prefetch={"eager"}
						href="#products"
						className="inline-flex items-center justify-center h-12 px-8 bg-white text-[#c8132b] rounded-full text-sm font-bold uppercase tracking-widest shadow-[0_10px_30px_rgba(0,0,0,0.25)] hover:scale-[1.03] transition-transform"
					>
						Shop The Box
					</YnsLink>
					<YnsLink
						prefetch={"eager"}
						href="#story"
						className="inline-flex items-center justify-center h-12 px-8 bg-transparent text-white rounded-full text-sm font-bold uppercase tracking-widest border-2 border-white/50 hover:bg-white/10 transition-colors"
					>
						Find In Store
					</YnsLink>
				</div>
			</div>
		</section>
	);
}

function JamBox({ className, flavor }: { className?: string; flavor: "berry" | "strawberry" }) {
	const isBerry = flavor === "berry";
	const bg = isBerry ? "#2a57c9" : "#f4a8b2";
	const accent = isBerry ? "#1d3f96" : "#e88494";
	const label = isBerry ? "BERRY" : "STRAWBERRY";

	return (
		<div className={className}>
			<div
				className="relative w-full aspect-[5/7] rounded-[18px] overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.4)]"
				style={{
					background: `linear-gradient(180deg, ${bg} 0%, ${bg} 55%, #ffffff 55%, #fff5e6 100%)`,
				}}
			>
				{/* Top dark band */}
				<div
					className="absolute top-0 left-0 right-0 h-[12%] flex items-center justify-between px-3 sm:px-4"
					style={{ background: accent }}
				>
					<span className="text-white text-[10px] sm:text-sm font-black uppercase tracking-tight">
						PB&amp;J
					</span>
					<div className="flex gap-1">
						<span className="bg-white rounded px-1.5 py-0.5 text-[7px] sm:text-[9px] font-black text-[#1a0810] leading-none">
							10g
							<br />
							<span className="text-[5px] sm:text-[7px] font-bold">PROTEIN</span>
						</span>
						<span className="bg-white rounded px-1.5 py-0.5 text-[7px] sm:text-[9px] font-black text-[#1a0810] leading-none">
							4<br />
							<span className="text-[5px] sm:text-[7px] font-bold">COUNT</span>
						</span>
					</div>
				</div>

				{/* Brand wordmark */}
				<div className="absolute inset-x-0 top-[20%] flex flex-col items-center">
					<span className="font-script text-white text-4xl sm:text-6xl lg:text-7xl leading-none drop-shadow-md">
						YNS
					</span>
					<span className="text-white text-[10px] sm:text-sm font-bold tracking-[0.3em] mt-1">{label}</span>
				</div>

				{/* Sandwich representation */}
				<div className="absolute inset-x-0 bottom-0 h-[40%] flex items-end justify-center">
					<div className="w-[80%] h-[70%] rounded-t-[60%] bg-gradient-to-b from-[#f5deb3] to-[#e8c887] relative overflow-hidden">
						<div className="absolute inset-x-2 top-[40%] h-[20%] bg-gradient-to-r from-[#c8132b] via-[#8b0a1c] to-[#c8132b] rounded-sm" />
						<div className="absolute inset-x-3 top-[55%] h-[15%] bg-gradient-to-r from-[#c79550] to-[#a87a3d] rounded-sm opacity-90" />
					</div>
				</div>

				{/* Bottom claims */}
				<div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-[7px] sm:text-[9px] font-black uppercase">
					<span className="bg-white/90 rounded-full px-2 py-1 text-[#1a0810]">No Seed Oils</span>
					<span className="bg-white/90 rounded-full px-2 py-1 text-[#1a0810]">Real Fruit</span>
				</div>
			</div>
		</div>
	);
}
