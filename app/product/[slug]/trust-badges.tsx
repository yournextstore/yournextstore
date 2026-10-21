// The booking card's terse footnote, set under the buy buttons.
const NOTES = ["Entered in the ledger", "Prices as they stand", "Settled at checkout"];

export function TrustBadges() {
	return (
		<ul className="ledger flex flex-wrap gap-x-5 gap-y-2 text-[0.62rem] tracking-[0.18em] text-faint">
			{NOTES.map((note) => (
				<li key={note} className="flex items-center gap-2">
					<span aria-hidden="true" className="text-gold">
						—
					</span>
					{note}
				</li>
			))}
		</ul>
	);
}
