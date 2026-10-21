// The counter's arrow list, under the buy buttons.
const NOTES = [
	"one basket · one honest total",
	"delivery worked out at checkout",
	"secure checkout when you’re ready",
];

export function TrustBadges() {
	return (
		<ul className="arrow-list grid gap-2">
			{NOTES.map((note) => (
				<li key={note}>{note}</li>
			))}
		</ul>
	);
}
