type IconProps = {
	className?: string;
};

export function InstagramIcon({ className }: IconProps) {
	return (
		<svg
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
			className={className}
			aria-hidden
		>
			<title>Instagram</title>
			<rect x="3" y="3" width="18" height="18" rx="5" />
			<circle cx="12" cy="12" r="4" />
			<circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" />
		</svg>
	);
}

export function FacebookIcon({ className }: IconProps) {
	return (
		<svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
			<title>Facebook</title>
			<path d="M13.5 21v-7h2.4l.4-3h-2.8V9.1c0-.9.3-1.5 1.6-1.5h1.3V5c-.6-.1-1.5-.2-2.4-.2-2.3 0-3.9 1.4-3.9 4v2.2H7.5v3h2.6V21h3.4z" />
		</svg>
	);
}
