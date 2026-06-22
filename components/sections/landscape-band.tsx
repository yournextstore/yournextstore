export function LandscapeBand() {
	return (
		<section className="bg-meadow relative isolate overflow-hidden">
			<div
				aria-hidden
				className="absolute inset-0 z-0"
				style={{
					backgroundImage:
						"radial-gradient(ellipse 60% 40% at 50% 80%, rgba(74,107,72,0.7) 0%, transparent 70%), radial-gradient(ellipse 100% 50% at 50% 0%, rgba(201,214,220,0.9) 0%, transparent 60%)",
				}}
			/>
			{/* Soft fog wisps */}
			<svg
				aria-hidden
				className="absolute inset-0 z-0 h-full w-full opacity-60"
				preserveAspectRatio="none"
				viewBox="0 0 1440 600"
			>
				<defs>
					<linearGradient id="fog1" x1="0" x2="0" y1="0" y2="1">
						<stop offset="0%" stopColor="#fffaee" stopOpacity="0.6" />
						<stop offset="100%" stopColor="#fffaee" stopOpacity="0" />
					</linearGradient>
				</defs>
				<ellipse cx="200" cy="380" rx="500" ry="50" fill="url(#fog1)" />
				<ellipse cx="900" cy="420" rx="600" ry="40" fill="url(#fog1)" />
				<ellipse cx="1300" cy="350" rx="400" ry="35" fill="url(#fog1)" />
			</svg>
			{/* Distant mountain silhouettes */}
			<svg
				aria-hidden
				className="absolute inset-x-0 bottom-0 z-0 h-2/3 w-full"
				preserveAspectRatio="none"
				viewBox="0 0 1440 400"
			>
				<path
					d="M0,260 L120,200 L220,240 L340,180 L460,230 L600,170 L760,220 L900,160 L1060,210 L1200,170 L1320,200 L1440,180 L1440,400 L0,400 Z"
					fill="#7a8d72"
					opacity="0.55"
				/>
				<path
					d="M0,320 L160,280 L320,310 L500,260 L680,300 L860,270 L1040,310 L1200,280 L1440,300 L1440,400 L0,400 Z"
					fill="#5e7355"
					opacity="0.8"
				/>
				<path d="M0,380 L1440,380 L1440,400 L0,400 Z" fill="#4a6b48" />
			</svg>

			<div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center px-6 py-24 text-center sm:py-32">
				<p className="font-mono text-[11px] uppercase leading-relaxed tracking-[0.32em] text-cream sm:text-sm sm:leading-loose drop-shadow-[0_1px_4px_rgba(0,0,0,0.4)]">
					For the home cook, the host, the health nut,
					<br />
					the vegetable-lover and meat eater, the flavor-lover
					<br />
					and the label-reader.
				</p>
			</div>
		</section>
	);
}
