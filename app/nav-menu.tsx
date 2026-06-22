"use client";

import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { YnsLink } from "@/components/yns-link";

type Collection = { id: string; slug: string; name: string };

export function NavMenu({ collections }: { collections: Collection[] }) {
	const [open, setOpen] = useState(false);

	useEffect(() => {
		const onKey = (e: KeyboardEvent) => {
			if (e.key === "Escape") setOpen(false);
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, []);

	useEffect(() => {
		document.body.style.overflow = open ? "hidden" : "";
		return () => {
			document.body.style.overflow = "";
		};
	}, [open]);

	return (
		<>
			<button
				type="button"
				onClick={() => setOpen(true)}
				className="p-2 hover:text-accent transition-colors"
				aria-label="Open menu"
			>
				<Menu className="w-[18px] h-[18px]" strokeWidth={1.25} />
			</button>
			<div
				className={`fixed inset-0 z-[70] transition-opacity duration-500 ${
					open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
				}`}
				aria-hidden={!open}
			>
				<button
					type="button"
					aria-label="Close menu"
					className="absolute inset-0 bg-ink/70 backdrop-blur-sm"
					style={{ backgroundColor: "rgba(14,13,11,0.75)" }}
					onClick={() => setOpen(false)}
				/>
				<aside
					className={`absolute top-0 left-0 h-full w-full max-w-md bg-ink text-parchment transition-transform duration-500 ${
						open ? "translate-x-0" : "-translate-x-full"
					}`}
					style={{ backgroundColor: "#0e0d0b", color: "#f5efe4" }}
				>
					<div className="flex items-center justify-between p-6 border-b border-parchment/10">
						<span className="font-mono text-[0.65rem] tracking-[0.3em] uppercase text-parchment/60">
							Menu / 01
						</span>
						<button
							type="button"
							onClick={() => setOpen(false)}
							className="p-1 hover:text-sand"
							aria-label="Close"
						>
							<X className="w-5 h-5" strokeWidth={1.25} />
						</button>
					</div>
					<nav className="px-6 py-10 space-y-1">
						<MenuLink href="/" label="Home" idx="01" onClick={() => setOpen(false)} />
						<MenuLink href="/products" label="All Products" idx="02" onClick={() => setOpen(false)} />
						{collections.map((c, i) => (
							<MenuLink
								key={c.id}
								href={`/collection/${c.slug}`}
								label={c.name}
								idx={String(i + 3).padStart(2, "0")}
								onClick={() => setOpen(false)}
							/>
						))}
					</nav>
					<div className="px-6 mt-10 pt-8 border-t border-parchment/10">
						<p className="font-mono text-[0.65rem] tracking-[0.25em] uppercase text-parchment/40 mb-4">
							Biotech / Skin / Science
						</p>
						<p className="font-serif text-2xl leading-tight text-parchment/90">
							From the cellular layer
							<br />
							to the human ritual.
						</p>
					</div>
					<div className="absolute bottom-6 left-6 right-6 flex items-center justify-between font-mono text-[0.6rem] tracking-[0.25em] uppercase text-parchment/40">
						<span>YNS · Est. 2026</span>
						<span>Lat 36.7°N</span>
					</div>
				</aside>
			</div>
		</>
	);
}

function MenuLink({
	href,
	label,
	idx,
	onClick,
}: {
	href: string;
	label: string;
	idx: string;
	onClick: () => void;
}) {
	return (
		<YnsLink
			href={href}
			onClick={onClick}
			prefetch={"eager"}
			className="group flex items-baseline gap-6 py-2.5 border-b border-parchment/5 hover:border-parchment/20 transition-colors"
		>
			<span className="font-mono text-[0.65rem] tracking-[0.2em] uppercase text-parchment/40 group-hover:text-sand transition-colors">
				{idx}
			</span>
			<span className="font-serif text-3xl tracking-tight text-parchment/90 group-hover:text-parchment transition-colors">
				{label}
			</span>
		</YnsLink>
	);
}
