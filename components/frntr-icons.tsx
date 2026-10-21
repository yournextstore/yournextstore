// The header's heavy outline icons (account, search, basket), drawn after the original's.

const base = "size-[26px] lg:size-[30px]";

export function AccountIcon() {
	return (
		<svg aria-hidden="true" viewBox="0 0 30 30" className={base} fill="none">
			<circle cx="15" cy="9.5" r="6" stroke="currentColor" strokeWidth="2.4" />
			<path
				d="M4.5 27.5v-3.2c0-4.3 3.3-7.3 7.4-7.3h6.2c4.1 0 7.4 3 7.4 7.3v3.2z"
				stroke="currentColor"
				strokeWidth="2.4"
				strokeLinejoin="round"
			/>
		</svg>
	);
}

export function SearchIcon() {
	return (
		<svg aria-hidden="true" viewBox="0 0 30 30" className={base} fill="none">
			<circle cx="13" cy="13" r="10" stroke="currentColor" strokeWidth="2.6" />
			<path d="M20.5 20.5l7 7" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
		</svg>
	);
}

export function BasketIcon() {
	return (
		<svg aria-hidden="true" viewBox="0 0 30 30" className={base} fill="none">
			<path
				d="M1.5 3h3.6l3.2 15.5h15.2l3-10.5H11.5"
				stroke="currentColor"
				strokeWidth="2.4"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<path d="M13 11.5h8.5M14 15h6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
			<circle cx="10.5" cy="25" r="2.2" fill="currentColor" />
			<circle cx="21.5" cy="25" r="2.2" fill="currentColor" />
		</svg>
	);
}
