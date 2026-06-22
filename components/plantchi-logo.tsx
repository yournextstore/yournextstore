type Props = { className?: string; size?: number };

export function PlantchiFlower({ className, size = 36 }: Props) {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 64 64"
			width={size}
			height={size}
			className={className}
			aria-hidden="true"
		>
			<title>YNS bloom</title>
			<g fill="currentColor">
				<circle cx="32" cy="11" r="10" />
				<circle cx="53" cy="20" r="10" />
				<circle cx="55" cy="42" r="10" />
				<circle cx="32" cy="53" r="10" />
				<circle cx="11" cy="42" r="10" />
				<circle cx="9" cy="20" r="10" />
			</g>
			<circle cx="32" cy="32" r="9" fill="#fbe9d7" />
		</svg>
	);
}

export function PlantchiLogoBadge() {
	return (
		<div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#1b2a2e] text-[#fbe9d7] shadow-[0_6px_20px_-8px_rgba(27,42,46,0.6)]">
			<PlantchiFlower size={32} />
		</div>
	);
}

export function PlantchiWordmark({ className }: { className?: string }) {
	return (
		<span className={className}>
			<span className="font-display font-black tracking-tight">Your</span>
			<span className="mx-1 text-[#f5a623] font-display font-black tracking-tight">Next</span>
			<span className="font-display font-black tracking-tight">Store</span>
		</span>
	);
}
