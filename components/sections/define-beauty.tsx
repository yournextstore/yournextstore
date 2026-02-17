import { YnsLink } from "@/components/yns-link";

export function DefineBeauty() {
	return (
		<section className="bg-brand-cream/50 py-16 sm:py-24">
			<div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
				<h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
					Define Beauty on Your Own Terms
				</h2>
				<p className="mt-6 text-base leading-relaxed text-muted-foreground sm:text-lg">
					Our dermatologist-formulated products ensure personalized care for your skin&apos;s ever-changing
					needs. Because let&apos;s face it, skin can be moody, and we&apos;re here to adapt.
				</p>
				<div className="mt-8">
					<YnsLink
						prefetch={"eager"}
						href="/products"
						className="inline-block border-2 border-foreground px-8 py-3 text-sm font-semibold uppercase tracking-widest text-foreground transition-colors hover:bg-foreground hover:text-primary-foreground"
					>
						Start Today
					</YnsLink>
				</div>
			</div>
		</section>
	);
}
