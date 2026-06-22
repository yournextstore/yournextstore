import Image from "next/image";

const POSTS = [
	{ src: "/scraped-1.jpg", handle: "@morningwithmilo", caption: "morning ritual ☕️" },
	{ src: "/scraped-3.jpg", handle: "@thekitchnclub", caption: "post-yoga fuel 💪" },
	{ src: "/scraped-4.jpg", handle: "@cornercafe", caption: "the new diner staple" },
	{ src: "/scraped-5.jpg", handle: "@daisyhillfarm", caption: "happy cow energy 🐄" },
];

export function UGCGrid() {
	return (
		<section className="relative bg-background border-b-2 border-foreground/10 overflow-hidden">
			<div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-20 sm:py-28">
				<div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-12 gap-4">
					<div className="max-w-xl">
						<p className="text-xs font-bold uppercase tracking-[0.25em] text-[var(--color-pink)] mb-3">
							#happytummyclub
						</p>
						<h2 className="display text-4xl sm:text-5xl lg:text-6xl uppercase leading-[0.95]">
							Spotted in
							<br />
							<span className="text-[var(--color-cobalt)] italic">the wild</span>
						</h2>
					</div>
					<a
						href="https://instagram.com"
						target="_blank"
						rel="noopener noreferrer"
						className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.18em] text-foreground hover:text-[var(--color-leaf-deep)] transition-colors self-start"
					>
						Tag us on IG
						<span aria-hidden>→</span>
					</a>
				</div>
				<div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
					{POSTS.map((post, i) => (
						<a
							key={post.handle}
							href="https://instagram.com"
							target="_blank"
							rel="noopener noreferrer"
							className="group relative aspect-square overflow-hidden rounded-3xl border-2 border-foreground/10 hover-pop"
							style={{ transform: `rotate(${[-1.5, 1, -0.5, 2][i]}deg)` }}
						>
							<Image
								src={post.src}
								alt={post.caption}
								fill
								sizes="(max-width: 768px) 50vw, 25vw"
								className="object-cover transition-transform duration-700 group-hover:scale-105"
							/>
							<div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
							<div className="absolute inset-x-3 bottom-3 text-white opacity-0 group-hover:opacity-100 transition-opacity">
								<p className="text-xs font-bold uppercase tracking-widest">{post.handle}</p>
								<p className="text-sm mt-1">{post.caption}</p>
							</div>
						</a>
					))}
				</div>
			</div>
		</section>
	);
}
