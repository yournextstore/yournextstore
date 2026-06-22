import Image from "next/image";
import { Newsletter } from "./newsletter";

function JellyDome({
	className,
	color1,
	color2,
	rotate = 0,
	size = 180,
}: {
	className?: string;
	color1: string;
	color2: string;
	rotate?: number;
	size?: number;
}) {
	const id = `jelly-${color1.replace("#", "")}-${color2.replace("#", "")}-${rotate}`;
	return (
		<svg
			width={size}
			height={size}
			viewBox="0 0 200 200"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			className={className}
			style={{ transform: `rotate(${rotate}deg)` }}
			aria-hidden="true"
		>
			<defs>
				<radialGradient id={`${id}-fill`} cx="0.35" cy="0.3" r="0.85">
					<stop offset="0%" stopColor="#fff" stopOpacity="0.55" />
					<stop offset="30%" stopColor={color1} stopOpacity="0.95" />
					<stop offset="100%" stopColor={color2} />
				</radialGradient>
				<radialGradient id={`${id}-shine`} cx="0.3" cy="0.2" r="0.5">
					<stop offset="0%" stopColor="#fff" stopOpacity="0.8" />
					<stop offset="100%" stopColor="#fff" stopOpacity="0" />
				</radialGradient>
			</defs>
			<path
				d="M30 130 Q30 30 100 30 Q170 30 170 130 Q170 145 155 145 L45 145 Q30 145 30 130 Z"
				fill={`url(#${id}-fill)`}
			/>
			<path d="M40 140 L160 140 Q165 152 145 156 L55 156 Q35 152 40 140 Z" fill={color2} opacity="0.85" />
			<ellipse cx="80" cy="70" rx="28" ry="18" fill={`url(#${id}-shine)`} />
			<circle cx="125" cy="105" r="3" fill="#fff" opacity="0.7" />
			<circle cx="65" cy="115" r="2" fill="#fff" opacity="0.6" />
		</svg>
	);
}

function DoodleArrow({ flip = false, className }: { flip?: boolean; className?: string }) {
	return (
		<svg
			width="80"
			height="64"
			viewBox="0 0 80 64"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			className={className}
			style={flip ? { transform: "scaleX(-1)" } : undefined}
			aria-hidden="true"
		>
			<path
				d="M6 8 C 22 4, 44 14, 56 32 C 62 42, 64 50, 60 56"
				stroke="#b8ee46"
				strokeWidth="3.5"
				strokeLinecap="round"
				fill="none"
			/>
			<path
				d="M51 50 L60 58 L69 50"
				stroke="#b8ee46"
				strokeWidth="3.5"
				strokeLinecap="round"
				strokeLinejoin="round"
				fill="none"
			/>
		</svg>
	);
}

export function Hero() {
	return (
		<section className="relative isolate overflow-hidden bg-[var(--pink)]">
			{/* Top photographic band */}
			<div className="relative h-[58vh] min-h-[420px] max-h-[640px] w-full">
				<Image
					src="/scraped-0.jpg"
					alt="Colorful jiggly snacks"
					fill
					priority
					sizes="100vw"
					className="object-cover"
				/>
				{/* Soft pink top fade to match announcement bar */}
				<div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[var(--pink)] via-[var(--pink)]/40 to-transparent" />
				{/* Side glow */}
				<div className="absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-[var(--lilac)]/60 via-[var(--lilac)]/15 to-transparent" />
				<div className="absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-[var(--pink)]/40 to-transparent" />

				{/* Floating jelly accents */}
				<JellyDome
					color1="#c89bff"
					color2="#5a2bae"
					size={140}
					rotate={-8}
					className="absolute left-[4%] top-[18%] float-soft hidden sm:block"
				/>
				<JellyDome
					color1="#ffe289"
					color2="#ffc83d"
					size={120}
					rotate={6}
					className="absolute right-[6%] top-[14%] float-soft hidden sm:block"
				/>

				{/* Bottom purple wave */}
				<svg
					className="absolute bottom-0 left-0 w-full h-32 sm:h-44"
					viewBox="0 0 1440 200"
					preserveAspectRatio="none"
					xmlns="http://www.w3.org/2000/svg"
					aria-hidden="true"
				>
					<path
						d="M0,120 C240,40 480,200 720,140 C960,80 1200,180 1440,100 L1440,200 L0,200 Z"
						fill="#7b6be8"
					/>
				</svg>
			</div>

			{/* Purple wave content area */}
			<div className="relative bg-purple-wave text-white">
				<div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 pt-4 pb-20 sm:pb-28 text-center">
					<h1 className="font-display text-balance text-4xl sm:text-6xl lg:text-7xl uppercase leading-[0.95] tracking-tight text-white text-shadow-jelly">
						<span className="font-script normal-case tracking-normal text-[var(--pink)] text-5xl sm:text-7xl lg:text-[5.5rem] inline-block align-middle mr-2 -rotate-3 drop-shadow-[0_2px_0_rgba(90,43,174,0.5)]">
							Your Next Store
						</span>
						<span className="inline-block align-middle">is clean, weird &amp; wonderful.</span>
					</h1>
					<p className="mx-auto mt-6 max-w-2xl text-base sm:text-lg lg:text-xl text-white/90 leading-relaxed">
						Our plant-based jiggly snacks are packed with real fruit purees and juices — and no artificial
						nonsense.
					</p>

					<div className="relative mx-auto mt-10 flex max-w-md items-center justify-center">
						<DoodleArrow className="absolute -left-2 sm:-left-14 -top-6 wiggle hidden sm:block" />
						<DoodleArrow flip className="absolute -right-2 sm:-right-14 -top-6 wiggle hidden sm:block" />
						<Newsletter />
					</div>
				</div>
			</div>
		</section>
	);
}
