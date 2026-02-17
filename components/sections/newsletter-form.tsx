"use client";

export function NewsletterForm() {
	return (
		<form className="flex gap-0 max-w-md mx-auto" onSubmit={(e) => e.preventDefault()}>
			<input
				type="email"
				placeholder="Email address"
				className="flex-1 px-4 py-3 bg-white/10 border border-white/20 text-white placeholder:text-white/50 text-sm focus:outline-none focus:border-white/40"
			/>
			<button
				type="submit"
				className="px-6 py-3 bg-white text-foreground text-sm font-medium hover:bg-white/90 transition-colors"
			>
				Sign up
			</button>
		</form>
	);
}
