// Three neutral notes under the buy buttons, in the info bar's caps with a brass ◆ between.
const NOTES = ["Secure checkout", "Delivery set at checkout", "Prices as shown"];

export function TrustBadges() {
	return (
		<ul className="caps flex flex-wrap gap-x-5 gap-y-2 text-[0.75rem] text-dim">
			{NOTES.map((note) => (
				<li key={note} className="flex items-center gap-2">
					<span aria-hidden="true" className="text-[0.6rem] text-gold">
						◆
					</span>
					{note}
				</li>
			))}
		</ul>
	);
}
