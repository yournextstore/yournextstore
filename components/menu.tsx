import { SearchIcon } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type MenuLink = { href: string; label: string; current?: boolean };

/**
 * The original's ordering shell: a 150px "MENU" column beside the content on desktop,
 * the content alone (with chips) on phones.
 */
export function MenuLayout({
	leading,
	children,
	className,
	id,
}: {
	leading: ReactNode;
	children: ReactNode;
	className?: string;
	id?: string;
}) {
	return (
		<div id={id} className={cn("shell pt-6 pb-16 lg:pt-10 lg:pb-20", className)}>
			<div className="grid grid-cols-1 lg:grid-cols-[150px_minmax(0,1fr)] lg:gap-12">
				<div className="hidden lg:block">{leading}</div>
				<div className="min-w-0">{children}</div>
			</div>
		</div>
	);
}

export function MenuSidebar({ links, label = "Shop" }: { links: MenuLink[]; label?: string }) {
	return (
		<nav aria-label="Shop categories" className="sticky top-20 flex flex-col gap-5 text-body-sm">
			<span className="text-label-sm uppercase text-muted-foreground">{label}</span>
			{links.map((link) => (
				<Link
					key={link.href}
					href={link.href}
					aria-current={link.current ? "page" : undefined}
					className={cn(
						"text-muted-foreground transition-colors hover:text-foreground",
						link.current && "font-semibold text-foreground",
					)}
				>
					{link.label}
				</Link>
			))}
		</nav>
	);
}

export function MenuChips({ links, label = "Jump to category" }: { links: MenuLink[]; label?: string }) {
	return (
		<nav
			aria-label={label}
			className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 pt-1 pb-5 lg:mx-0 lg:px-0"
		>
			{links.map((link) => (
				<Link
					key={link.href}
					href={link.href}
					aria-current={link.current ? "true" : undefined}
					className="chip"
				>
					{link.label}
				</Link>
			))}
		</nav>
	);
}

/** "Search the shop": a plain GET form onto the storefront's search page. */
export function MenuSearch({ defaultValue }: { defaultValue?: string }) {
	return (
		<search className="mb-4">
			<form action="/search">
				<label className="flex h-11 items-center gap-2 rounded-input border border-border bg-card px-3.5 transition-colors focus-within:border-foreground">
					<SearchIcon
						aria-hidden="true"
						className="size-5 shrink-0 text-muted-foreground"
						strokeWidth={1.5}
					/>
					<span className="sr-only">Search the shop</span>
					<input
						type="search"
						name="q"
						defaultValue={defaultValue}
						placeholder="Search the shop"
						className="h-full min-w-0 flex-1 bg-transparent text-body-md outline-none placeholder:text-muted-foreground focus-visible:outline-none"
					/>
				</label>
			</form>
		</search>
	);
}

export function SectionHeader({
	title,
	description,
	action,
	as: Heading = "h2",
	id,
}: {
	title: string;
	description?: string | null;
	action?: ReactNode;
	as?: "h1" | "h2";
	id?: string;
}) {
	return (
		<header className="mb-4 flex items-end justify-between gap-4">
			<div className="min-w-0">
				<Heading
					id={id}
					className={cn(
						"font-display font-semibold leading-[1.1]",
						Heading === "h1" ? "text-display-sm lg:text-display-md" : "text-heading-lg",
					)}
				>
					{title}
				</Heading>
				{description ? <p className="mt-1 text-body-sm text-muted-foreground">{description}</p> : null}
			</div>
			{action}
		</header>
	);
}

export function SectionLink({
	href,
	children,
	label,
}: {
	href: string;
	children: ReactNode;
	label?: string;
}) {
	return (
		<Link
			href={href}
			aria-label={label}
			className="shrink-0 border-b border-current pb-1 text-body-sm font-semibold transition-colors hover:text-primary"
		>
			{children}
		</Link>
	);
}

export function MenuGrid({ children, className }: { children: ReactNode; className?: string }) {
	return (
		<div className={cn("grid grid-cols-2 gap-x-3 gap-y-8 lg:grid-cols-3 lg:gap-x-5", className)}>
			{children}
		</div>
	);
}
