import Image from "next/image";
import { YnsLink } from "../yns-link";

export function Hero() {
	return (
		<section className="relative overflow-hidden bg-hero-peach">
			<div
				aria-hidden="true"
				className="absolute inset-0 opacity-[0.18] pointer-events-none"
				style={{
					backgroundImage:
						"radial-gradient(circle at 20% 80%, #4b1fb5 0%, transparent 35%), radial-gradient(circle at 80% 20%, #f4884a 0%, transparent 40%)",
				}}
			/>
			<Image
				src="/hero-bg-1.svg"
				alt=""
				width={1200}
				height={800}
				className="absolute inset-0 w-full h-full object-cover opacity-20 pointer-events-none"
				priority={false}
			/>

			<div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="grid lg:grid-cols-2 gap-8 items-center pt-12 pb-20 sm:pt-16 sm:pb-28 lg:pt-20 lg:pb-32 min-h-[640px]">
					<div className="relative z-10 max-w-xl">
						<h1 className="text-4xl sm:text-5xl lg:text-6xl leading-[1.05]">
							<span className="block font-extrabold text-[#4b1fb5]">Supplements just got</span>
							<span className="font-marker block text-[#f5c518] text-6xl sm:text-7xl lg:text-[7.5rem] mt-2 -rotate-2 leading-none drop-shadow-[2px_3px_0_rgba(26,15,77,0.15)]">
								SMARTER
							</span>
							<span className="block font-extrabold text-[#4b1fb5] mt-4">And a lot more</span>
							<span className="font-marker block text-[#f4884a] text-6xl sm:text-7xl lg:text-[7.5rem] mt-1 rotate-3 leading-none drop-shadow-[2px_3px_0_rgba(26,15,77,0.15)]">
								FUN
							</span>
						</h1>

						<div className="mt-10 flex flex-col sm:flex-row gap-3">
							<YnsLink
								prefetch="eager"
								href="/products"
								className="inline-flex items-center justify-center gap-2 h-12 px-10 bg-[#4b1fb5] text-white rounded-full text-xs font-extrabold uppercase tracking-[0.2em] hover:bg-[#3a17a0] transition-all shadow-[0_6px_0_#1a0f4d] hover:shadow-[0_3px_0_#1a0f4d] hover:translate-y-[3px]"
							>
								Shop All
							</YnsLink>
						</div>
					</div>

					<div className="relative h-[480px] sm:h-[560px]">
						<div className="absolute top-[6%] right-[18%] w-[42%] animate-float-slow z-20">
							<div className="relative aspect-square">
								<Image
									src="/scraped-0.jpg"
									alt="Featured supplement"
									fill
									sizes="(max-width:1024px) 60vw, 30vw"
									className="object-contain drop-shadow-[6px_10px_18px_rgba(26,15,77,0.25)]"
								/>
							</div>
						</div>
						<div className="absolute top-[30%] right-[2%] w-[34%] animate-float-slower z-10">
							<div className="relative aspect-square">
								<Image
									src="/scraped-1.jpg"
									alt=""
									fill
									sizes="(max-width:1024px) 50vw, 25vw"
									className="object-contain drop-shadow-[6px_10px_18px_rgba(26,15,77,0.25)]"
								/>
							</div>
						</div>
						<div className="absolute bottom-[6%] right-[28%] w-[38%] animate-float-slow z-30">
							<div className="relative aspect-square">
								<Image
									src="/scraped-2.jpg"
									alt=""
									fill
									sizes="(max-width:1024px) 55vw, 28vw"
									className="object-contain drop-shadow-[6px_10px_18px_rgba(26,15,77,0.25)]"
								/>
							</div>
						</div>

						<span
							aria-hidden="true"
							className="absolute top-[20%] left-[8%] w-10 h-10 rotate-12 bg-[#f4884a] rounded-sm z-0"
						/>
						<span
							aria-hidden="true"
							className="absolute bottom-[12%] left-[20%] w-12 h-12 -rotate-12 bg-[#f5c518] rounded-sm z-0"
						/>
						<span
							aria-hidden="true"
							className="absolute top-[8%] right-[6%] w-8 h-8 rotate-45 bg-[#4b1fb5]/20 rounded-sm z-0"
						/>
					</div>
				</div>

				<div className="absolute right-4 lg:right-12 bottom-4 lg:bottom-8 z-40 hidden sm:block">
					<AsSeenOn />
				</div>
			</div>
		</section>
	);
}

function AsSeenOn() {
	return (
		<div className="flex items-center gap-4 rounded-full bg-[#4b1fb5] py-2 pl-5 pr-2 shadow-[0_8px_24px_rgba(26,15,77,0.25)]">
			<span className="text-white text-xs sm:text-sm font-bold tracking-wider uppercase">As Seen On</span>
			<div className="flex -space-x-2">
				{[
					{ label: "NBC", bg: "#fff", color: "#1a0f4d" },
					{ label: "abc", bg: "#000", color: "#fff" },
					{ label: "CBS", bg: "#fff", color: "#1a0f4d" },
					{ label: "FOX", bg: "#fff", color: "#1a0f4d" },
				].map((n) => (
					<span
						key={n.label}
						className="inline-flex h-10 w-10 items-center justify-center rounded-full ring-2 ring-[#4b1fb5] text-[10px] font-extrabold"
						style={{ backgroundColor: n.bg, color: n.color }}
					>
						{n.label}
					</span>
				))}
			</div>
		</div>
	);
}
