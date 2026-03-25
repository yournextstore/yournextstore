"use client";

export function NewsletterForm() {
	return (
		<form className="flex max-w-xl flex-col gap-3 sm:flex-row" onSubmit={(e) => e.preventDefault()}>
			<input
				type="email"
				placeholder="Email address"
				className="h-12 flex-1 border border-white/18 bg-white/6 px-4 text-sm text-white placeholder:text-white/46 focus:border-white/38 focus:outline-none"
			/>
			<button
				type="submit"
				className="h-12 border border-white bg-white px-5 text-[0.72rem] uppercase tracking-[0.18em] text-foreground transition-colors hover:bg-white/92"
			>
				Join now
			</button>
		</form>
	);
}
