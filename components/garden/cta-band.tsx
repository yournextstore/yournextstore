import Link from "next/link";

/** Closing band shared by the product and about pages. */
export function CtaBand() {
	return (
		<section className="section cta-band">
			<div className="wrap cta-band__inner">
				<div>
					<h2>
						Not sure this is the one?
						<br />
						Ask us before you buy.
					</h2>
					<span className="hand">Tell us what you have in mind. We&apos;ll tell you honestly.</span>
				</div>
				<div className="cta-band__actions">
					<Link className="btn" href="/faq">
						Read the FAQ <span className="arw">&rarr;</span>
					</Link>
					<Link className="btn btn-ghost" href="/products">
						Keep browsing
					</Link>
				</div>
			</div>
		</section>
	);
}
