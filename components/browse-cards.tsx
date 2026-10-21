import Link from "next/link";

type BrowseItem = { id: string; name: string; description: string; href: string };

/** The original's Categories page: tall surface cards, display name, "Browse →". */
export function BrowseCards({
	kicker,
	title,
	items,
}: {
	kicker: string;
	title: string;
	items: BrowseItem[];
}) {
	return (
		<div className="shop-container min-h-svh py-16">
			<p className="kicker mb-2">{kicker}</p>
			<h1 className="mb-10 font-display text-[clamp(2.5rem,6vw,5rem)] font-semibold leading-tight text-foreground">
				{title}
			</h1>
			{items.length === 0 ? (
				<p className="py-24 text-center font-display text-3xl italic text-muted-foreground">
					Nothing here yet
				</p>
			) : (
				<ul
					className={
						items.length === 1
							? "grid max-w-xl grid-cols-1 gap-5"
							: "grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
					}
				>
					{items.map((item) => (
						<li key={item.id}>
							<Link
								href={item.href}
								className="shop-card group flex min-h-40 flex-col justify-end rounded-2xl border border-border bg-card p-8 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(0,0,0,0.10)]"
							>
								<h2 className="wrap-break-word font-display text-2xl font-semibold text-foreground transition-colors group-hover:text-brand">
									{item.name}
								</h2>
								{item.description && (
									<p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{item.description}</p>
								)}
								<span className="mt-3 text-xs font-semibold uppercase tracking-[0.14em] text-brand group-hover:underline">
									Browse <span aria-hidden>→</span>
								</span>
							</Link>
						</li>
					))}
				</ul>
			)}
			<div className="mt-8 text-center">
				<Link
					href="/products"
					className="text-sm font-semibold text-muted-foreground transition-colors hover:text-brand"
				>
					View all products <span aria-hidden>→</span>
				</Link>
			</div>
		</div>
	);
}
