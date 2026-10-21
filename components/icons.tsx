// The original's own 24px line icons (public/icon/*.svg), drawn in currentColor.

type IconProps = { className?: string };

export function MenuIcon({ className }: IconProps) {
	return (
		<svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" className={className}>
			<path d="M18 7.5H6V6H18V7.5Z" />
			<path d="M18 12.5H6V11H18V12.5Z" />
			<path d="M6 17.5H18V16H6V17.5Z" />
		</svg>
	);
}

export function CloseIcon({ className }: IconProps) {
	return (
		<svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" className={className}>
			<path d="M12.0303 13.091L17 18.0607L18.0607 17L13.091 12.0303L18.0607 7.06067L17 6.00001L12.0303 10.9697L7.06066 6L6 7.06066L10.9697 12.0303L6 17L7.06066 18.0607L12.0303 13.091Z" />
		</svg>
	);
}

export function CartIcon({ className }: IconProps) {
	return (
		<svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" className={className}>
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M19.5 8.5H15.5V8C15.5 6.067 13.933 4.5 12 4.5C10.067 4.5 8.5 6.067 8.5 8V8.5H4.5V19.5H19.5V8.5ZM14 11.5V10H10V11.5H8.5V10H6V18H18V10H15.5V11.5H14ZM10 8V8.5H14V8C14 6.89543 13.1046 6 12 6C10.8954 6 10 6.89543 10 8Z"
			/>
		</svg>
	);
}

export function ArrowLongRightIcon({ className }: IconProps) {
	return (
		<svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" className={className}>
			<path d="M20 12L14 18L12.9393 16.9393L17.1287 12.75L4 12.75V11.25L17.1287 11.25L12.9393 7.06066L14 6L20 12Z" />
		</svg>
	);
}

export function PlusIcon({ className }: IconProps) {
	return (
		<svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" className={className}>
			<path d="M12.75 11.25V6H11.25V11.25L6 11.25V12.75L11.25 12.75V18H12.75V12.75L18 12.75V11.25L12.75 11.25Z" />
		</svg>
	);
}

export function MinusIcon({ className }: IconProps) {
	return (
		<svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" className={className}>
			<path fillRule="evenodd" clipRule="evenodd" d="M18 12.75L6 12.75L6 11.25L18 11.25V12.75Z" />
		</svg>
	);
}

export function StarOutlineIcon({ className }: IconProps) {
	return (
		<svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" className={className}>
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M14.9695 9.32412L12.4117 4L9.85393 9.32412L4 10.1115L8.27314 14.1893L7.21298 20L12.4117 17.1961L17.6104 20L16.5503 14.1893L20.8234 10.1115L14.9695 9.32412ZM16.9384 11.3738L13.7881 10.9501L12.4117 8.08495L11.0353 10.9501L7.88502 11.3738L10.1846 13.5682L9.61406 16.6952L12.4117 15.1863L15.2093 16.6952L14.6388 13.5682L16.9384 11.3738Z"
			/>
		</svg>
	);
}

export function StarSolidIcon({ className }: IconProps) {
	return (
		<svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" className={className}>
			<path d="M11.4117 4L13.9695 9.32412L19.8234 10.1115L15.5503 14.1893L16.6104 20L11.4117 17.1961L6.21298 20L7.27314 14.1893L3 10.1115L8.85393 9.32412L11.4117 4Z" />
		</svg>
	);
}

/** Five outline stars with a solid row clipped to the rating, as in the original's ReviewStars. */
export function ReviewStars({ rating, showValue = true }: { rating: number; showValue?: boolean }) {
	const stars = [0, 1, 2, 3, 4];
	return (
		<div className="flex items-center">
			<span className="relative flex" role="img" aria-label={`${rating.toFixed(1)} out of 5 stars`}>
				{stars.map((i) => (
					<StarOutlineIcon key={i} className="size-4" />
				))}
				<span
					className="absolute inset-y-0 left-0 flex overflow-hidden"
					style={{ width: `${Math.min(5, Math.max(0, rating)) * 20}%` }}
				>
					{stars.map((i) => (
						<StarSolidIcon key={i} className="size-4 shrink-0" />
					))}
				</span>
			</span>
			{showValue && <span className="ml-2 text-caption font-semibold">{Number(rating.toFixed(1))}/5</span>}
		</div>
	);
}
