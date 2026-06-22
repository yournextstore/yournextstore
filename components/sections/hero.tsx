import { ArrowRightIcon, Leaf, Sparkles, Truck } from "lucide-react";
import { YnsLink } from "../yns-link";

function ProduceBag() {
	return (
		<svg
			viewBox="0 0 480 420"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			className="h-full w-full"
			aria-hidden="true"
		>
			<defs>
				<linearGradient id="bag" x1="0" x2="0" y1="0" y2="1">
					<stop offset="0" stopColor="#3a9c63" />
					<stop offset="1" stopColor="#1a7a4c" />
				</linearGradient>
				<linearGradient id="bagFold" x1="0" x2="0" y1="0" y2="1">
					<stop offset="0" stopColor="#52b07a" />
					<stop offset="1" stopColor="#2c8a55" />
				</linearGradient>
				<radialGradient id="leaf" cx=".5" cy=".5" r=".7">
					<stop offset="0" stopColor="#9be0a9" />
					<stop offset="1" stopColor="#3aa166" />
				</radialGradient>
				<radialGradient id="tomato" cx=".4" cy=".35" r=".7">
					<stop offset="0" stopColor="#ff8870" />
					<stop offset="1" stopColor="#cf2a1f" />
				</radialGradient>
				<radialGradient id="carrot" cx=".4" cy=".3" r=".8">
					<stop offset="0" stopColor="#ffb066" />
					<stop offset="1" stopColor="#e07a1f" />
				</radialGradient>
				<radialGradient id="onion" cx=".5" cy=".4" r=".7">
					<stop offset="0" stopColor="#f7d8b8" />
					<stop offset="1" stopColor="#c98556" />
				</radialGradient>
				<radialGradient id="eggplant" cx=".4" cy=".4" r=".8">
					<stop offset="0" stopColor="#9b6bcf" />
					<stop offset="1" stopColor="#4a1f6e" />
				</radialGradient>
				<radialGradient id="corn" cx=".5" cy=".4" r=".7">
					<stop offset="0" stopColor="#ffe07a" />
					<stop offset="1" stopColor="#d99e10" />
				</radialGradient>
			</defs>

			{/* soft halo */}
			<circle cx="250" cy="220" r="200" fill="#ffffff" opacity=".08" />

			{/* The bag */}
			<path d="M120 200 h220 l-18 180 c-2 18 -16 30 -34 30 h-116 c-18 0 -32 -12 -34 -30 z" fill="url(#bag)" />
			<path d="M120 200 h220 v22 c-110 14 -110 14 -220 0 z" fill="url(#bagFold)" />
			<path d="M150 220 v160" stroke="#0c4a2d" strokeWidth="2" opacity=".25" />
			<path d="M310 220 v160" stroke="#0c4a2d" strokeWidth="2" opacity=".25" />

			{/* leafy greens spilling out */}
			<g transform="translate(150 110)">
				<path d="M0 80 C 10 30 60 0 100 10 C 90 50 60 90 0 80 Z" fill="url(#leaf)" />
				<path d="M30 60 C 40 30 70 20 90 30" stroke="#0f5132" strokeWidth="3" fill="none" opacity=".4" />
			</g>
			<g transform="translate(250 90) rotate(15)">
				<path d="M0 90 C -10 30 60 -10 110 5 C 100 50 60 100 0 90 Z" fill="url(#leaf)" />
			</g>

			{/* corn */}
			<g transform="translate(220 80) rotate(-12)">
				<ellipse cx="0" cy="0" rx="20" ry="55" fill="url(#corn)" />
				<path d="M-10 -50 C -16 -70 -2 -78 6 -60" fill="#a3d076" />
				<path d="M10 -48 C 18 -65 30 -60 22 -42" fill="#86c25b" />
			</g>

			{/* tomatoes */}
			<g transform="translate(135 200)">
				<circle r="32" fill="url(#tomato)" />
				<path d="M -8 -28 C -4 -34 4 -34 8 -28 L 0 -22 Z" fill="#2c8a55" />
			</g>
			<g transform="translate(320 195)">
				<circle r="26" fill="url(#tomato)" />
				<path d="M -7 -22 C -3 -28 3 -28 7 -22 L 0 -16 Z" fill="#2c8a55" />
			</g>

			{/* eggplant */}
			<g transform="translate(180 160) rotate(-20)">
				<ellipse cx="0" cy="20" rx="22" ry="40" fill="url(#eggplant)" />
				<path
					d="M -6 -18 C -4 -28 4 -28 6 -18"
					stroke="#2c8a55"
					strokeWidth="6"
					fill="none"
					strokeLinecap="round"
				/>
			</g>

			{/* onion */}
			<g transform="translate(260 200)">
				<ellipse cx="0" cy="0" rx="28" ry="32" fill="url(#onion)" />
				<path d="M -16 -10 C -10 10 10 10 16 -10" stroke="#a26a3e" strokeWidth="2" fill="none" opacity=".5" />
			</g>

			{/* carrots */}
			<g transform="translate(380 200) rotate(20)">
				<path d="M -10 -10 L 10 -10 L 0 70 Z" fill="url(#carrot)" />
				<path d="M -10 -10 C -16 -28 0 -34 4 -22" fill="#86c25b" />
				<path d="M 10 -10 C 18 -25 30 -20 22 -10" fill="#86c25b" />
			</g>

			{/* shadow */}
			<ellipse cx="230" cy="410" rx="160" ry="10" fill="#000" opacity=".12" />
		</svg>
	);
}

export function Hero() {
	return (
		<section className="bg-mint-wash">
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<div className="relative overflow-hidden rounded-[28px] bg-brand-mesh text-white shadow-card my-6 sm:my-10">
					{/* decorative blobs */}
					<div
						aria-hidden="true"
						className="pointer-events-none absolute -left-32 -top-32 h-72 w-72 rounded-full bg-white/10 blur-2xl"
					/>
					<div
						aria-hidden="true"
						className="pointer-events-none absolute -right-24 -bottom-24 h-80 w-80 rounded-full bg-[var(--accent-saffron)]/30 blur-3xl"
					/>
					<div
						aria-hidden="true"
						className="pointer-events-none absolute inset-0 opacity-[0.06]"
						style={{
							backgroundImage: "radial-gradient(rgba(255,255,255,0.6) 1px, transparent 1px)",
							backgroundSize: "22px 22px",
						}}
					/>

					<div className="grid items-center gap-6 px-6 py-10 sm:px-10 sm:py-14 lg:grid-cols-2 lg:gap-12 lg:px-14 lg:py-16">
						<div className="relative">
							<span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-[var(--accent-saffron)]">
								<Sparkles className="h-3.5 w-3.5" />
								Farm fresh · Delivered today
							</span>
							<h1 className="mt-4 font-display text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl lg:text-[56px]">
								We bring the store
								<br />
								to your door
							</h1>
							<p className="mt-5 max-w-md text-base text-white/80 sm:text-lg">
								Shop organic produce and sustainably sourced essentials — handpicked from local growers and
								delivered to your kitchen in under an hour.
							</p>
							<div className="mt-8 flex flex-col gap-3 sm:flex-row">
								<YnsLink
									prefetch={"eager"}
									href="#products"
									className="inline-flex items-center justify-center gap-2 rounded-full bg-[var(--accent-saffron)] px-7 py-3.5 text-sm font-semibold text-[var(--brand-deep)] shadow-soft transition hover:brightness-95"
								>
									Shop now
									<ArrowRightIcon className="h-4 w-4" />
								</YnsLink>
								<YnsLink
									prefetch={"eager"}
									href="/products"
									className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/5 px-7 py-3.5 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/10"
								>
									Browse aisles
								</YnsLink>
							</div>

							<dl className="mt-10 grid grid-cols-3 gap-4 border-t border-white/10 pt-6 text-left text-xs sm:text-sm">
								<div className="flex items-start gap-2">
									<Truck className="mt-0.5 h-4 w-4 text-[var(--accent-saffron)]" />
									<div>
										<dt className="font-semibold text-white">Free delivery</dt>
										<dd className="text-white/60">Orders over $35</dd>
									</div>
								</div>
								<div className="flex items-start gap-2">
									<Leaf className="mt-0.5 h-4 w-4 text-[var(--accent-saffron)]" />
									<div>
										<dt className="font-semibold text-white">100% Organic</dt>
										<dd className="text-white/60">Locally sourced</dd>
									</div>
								</div>
								<div className="flex items-start gap-2">
									<Sparkles className="mt-0.5 h-4 w-4 text-[var(--accent-saffron)]" />
									<div>
										<dt className="font-semibold text-white">Daily harvest</dt>
										<dd className="text-white/60">Picked at dawn</dd>
									</div>
								</div>
							</dl>
						</div>

						<div className="relative mx-auto h-[300px] w-full max-w-md sm:h-[380px] lg:h-[420px]">
							<ProduceBag />
							{/* floating badges */}
							<div className="absolute right-4 top-6 rotate-6 rounded-2xl bg-white px-4 py-3 text-left text-[var(--brand-deep)] shadow-card">
								<div className="text-[10px] font-semibold uppercase tracking-wider text-[var(--brand)]">
									Today only
								</div>
								<div className="font-display text-lg font-bold leading-tight">30% off</div>
								<div className="text-[11px] text-[var(--muted-foreground)]">Fresh organic veg</div>
							</div>
							<div className="absolute -left-2 bottom-10 -rotate-3 rounded-2xl bg-[var(--accent-saffron)] px-4 py-3 text-left text-[var(--brand-deep)] shadow-card">
								<div className="text-[10px] font-semibold uppercase tracking-wider">Delivered in</div>
								<div className="font-display text-xl font-extrabold leading-none">45 min</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
