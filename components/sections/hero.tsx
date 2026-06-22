import {
	ArrowRightIcon,
	BoxIcon,
	ClockIcon,
	DropletIcon,
	LeafIcon,
	PackageIcon,
	ShieldIcon,
	TagIcon,
	TruckIcon,
} from "lucide-react";
import { YnsLink } from "../yns-link";

const FEATURES = [
	{ icon: DropletIcon, label: "A unique edit of 11 shades" },
	{ icon: PackageIcon, label: "Compact & Bag Friendly" },
	{ icon: ShieldIcon, label: "Leakproof Design" },
	{ icon: BoxIcon, label: "Holds 480ml" },
	{ icon: LeafIcon, label: "BPA-Free Lightweight Tritan Plastic" },
];

const TRUST = [
	{ icon: TruckIcon, label: "Free Delivery on Bundles" },
	{ icon: ClockIcon, label: "Fast Shipping" },
	{ icon: TagIcon, label: "Up to 30% Off Bundles" },
];

function Bottle({
	color,
	cap,
	strap,
	className = "",
	style,
}: {
	color: string;
	cap: string;
	strap: string;
	className?: string;
	style?: React.CSSProperties;
}) {
	return (
		<svg
			viewBox="0 0 160 220"
			className={className}
			style={style}
			aria-hidden
			xmlns="http://www.w3.org/2000/svg"
		>
			<defs>
				<linearGradient id={`g-${color}`} x1="0" x2="1" y1="0" y2="1">
					<stop offset="0%" stopColor={color} stopOpacity="0.85" />
					<stop offset="50%" stopColor={color} stopOpacity="0.55" />
					<stop offset="100%" stopColor={color} stopOpacity="0.85" />
				</linearGradient>
				<linearGradient id={`sheen-${color}`} x1="0" x2="0" y1="0" y2="1">
					<stop offset="0%" stopColor="#ffffff" stopOpacity="0.55" />
					<stop offset="50%" stopColor="#ffffff" stopOpacity="0.05" />
					<stop offset="100%" stopColor="#ffffff" stopOpacity="0.25" />
				</linearGradient>
			</defs>
			{/* shadow */}
			<ellipse cx="80" cy="210" rx="58" ry="6" fill="#000" opacity="0.18" />
			{/* strap */}
			<path d={`M 102 30 Q 132 18 128 50 L 124 58 Q 120 48 108 48 Z`} fill={strap} opacity="0.95" />
			<rect x="100" y="22" width="14" height="10" rx="3" fill={strap} />
			{/* bottle body */}
			<rect
				x="22"
				y="28"
				width="116"
				height="172"
				rx="14"
				fill={`url(#g-${color})`}
				stroke={color}
				strokeOpacity="0.6"
			/>
			{/* inner window */}
			<rect
				x="34"
				y="44"
				width="92"
				height="140"
				rx="8"
				fill="#ffffff"
				fillOpacity="0.45"
				stroke="#ffffff"
				strokeOpacity="0.6"
			/>
			{/* sheen */}
			<rect x="38" y="48" width="22" height="130" rx="6" fill={`url(#sheen-${color})`} />
			{/* cap */}
			<rect x="62" y="14" width="36" height="22" rx="6" fill={cap} />
			<rect x="66" y="12" width="28" height="6" rx="3" fill={cap} opacity="0.85" />
			{/* tiny logo */}
			<text
				x="80"
				y="120"
				textAnchor="middle"
				fontFamily="Inter, sans-serif"
				fontSize="11"
				fontWeight="700"
				fill={cap}
				opacity="0.55"
			>
				YNS.
			</text>
		</svg>
	);
}

export function Hero() {
	return (
		<section className="relative overflow-hidden bg-hero-cream">
			{/* subtle grain via SVG */}
			<div
				aria-hidden
				className="pointer-events-none absolute inset-0 opacity-[0.06] mix-blend-multiply"
				style={{
					backgroundImage:
						"url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='180' height='180'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.7'/></svg>\")",
				}}
			/>

			<div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">
				<div className="grid lg:grid-cols-2 gap-10 lg:gap-6 items-center min-h-[640px] py-12 lg:py-20">
					{/* Left text block */}
					<div className="relative z-10 max-w-xl lg:pl-6">
						<p className="font-display italic text-[15px] text-[#14111c]/70 leading-relaxed">
							&ldquo;Light enough to forget you&rsquo;re carrying it, bold enough that everyone else
							won&rsquo;t.&rdquo;
						</p>
						<h1 className="mt-5 font-display text-[58px] sm:text-[72px] lg:text-[80px] leading-[0.95] tracking-[-0.03em] text-[#14111c]">
							Stay Hydrated.
							<br />
							<span className="text-[#5e3ca8]">Stay Elevated.</span>
						</h1>

						<ul className="mt-8 space-y-2.5">
							{FEATURES.map(({ icon: Icon, label }) => (
								<li key={label} className="flex items-center gap-3 text-[15px] text-[#14111c]/85">
									<span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#e4daf5] text-[#5e3ca8]">
										<Icon className="h-3.5 w-3.5" strokeWidth={2.2} />
									</span>
									{label}
								</li>
							))}
						</ul>

						<div className="mt-8">
							<YnsLink
								prefetch={"eager"}
								href="#bundles"
								className="group inline-flex w-full sm:w-[360px] items-center justify-center gap-2 h-12 px-6 rounded-full bg-[#5e3ca8] text-white text-[15px] font-semibold shadow-[0_10px_30px_-10px_rgba(94,60,168,0.6)] hover:bg-[#4e2f95] transition-all"
							>
								Save More With Bundles
								<ArrowRightIcon className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
							</YnsLink>
						</div>

						<div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
							{TRUST.map(({ icon: Icon, label }) => (
								<div
									key={label}
									className="flex items-center gap-2 text-[12.5px] font-medium text-[#14111c]/75"
								>
									<Icon className="h-4 w-4 text-[#14111c]" strokeWidth={2} />
									{label}
								</div>
							))}
						</div>
					</div>

					{/* Right product still life */}
					<div className="relative h-[540px] lg:h-[600px] hidden md:block">
						{/* baby-blue pedestal cubes */}
						<div
							className="absolute bottom-10 left-[8%] w-[260px] h-[260px] rounded-[14px]"
							style={{
								background: "linear-gradient(140deg, #c4dfe3 0%, #a8d4d4 60%, #94c5c8 100%)",
								boxShadow: "inset -16px -22px 30px rgba(0,0,0,0.08), 0 30px 60px -30px rgba(94,60,168,0.25)",
							}}
						/>
						<div
							className="absolute bottom-32 left-[16%] w-[180px] h-[180px] rounded-[12px]"
							style={{
								background: "linear-gradient(140deg, #d4e8eb 0%, #b9d8d8 60%, #a3cccd 100%)",
								boxShadow: "inset -10px -16px 24px rgba(0,0,0,0.08), 0 20px 40px -20px rgba(94,60,168,0.2)",
							}}
						/>
						<div
							className="absolute bottom-8 right-[6%] w-[220px] h-[220px] rounded-[14px]"
							style={{
								background: "linear-gradient(140deg, #c4dfe3 0%, #a8d4d4 60%, #94c5c8 100%)",
								boxShadow: "inset -16px -22px 30px rgba(0,0,0,0.08), 0 30px 60px -30px rgba(94,60,168,0.25)",
							}}
						/>

						{/* bottles */}
						<Bottle
							color="#b4a4dd"
							cap="#5e3ca8"
							strap="#7a5fc4"
							className="absolute bottom-[250px] left-[10%] w-[180px] drop-shadow-2xl animate-float"
							style={{ animationDelay: "0s" }}
						/>
						<Bottle
							color="#c4d8a8"
							cap="#7a946a"
							strap="#b7c79a"
							className="absolute bottom-[180px] right-[10%] w-[150px] drop-shadow-2xl animate-float"
							style={{ animationDelay: "1.5s" }}
						/>
						<Bottle
							color="#e8b89c"
							cap="#a8745a"
							strap="#c9967a"
							className="absolute bottom-[35px] left-[28%] w-[155px] -rotate-6 drop-shadow-2xl animate-float"
							style={{ animationDelay: "0.8s" }}
						/>
						<Bottle
							color="#f2c14a"
							cap="#b3852a"
							strap="#d4a73a"
							className="absolute bottom-[50px] right-[18%] w-[165px] rotate-[18deg] drop-shadow-2xl animate-float"
							style={{ animationDelay: "2.2s" }}
						/>
					</div>
				</div>
			</div>
		</section>
	);
}
