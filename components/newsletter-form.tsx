"use client";

export function NewsletterForm() {
	return (
		<form
			className="flex w-full sm:w-auto"
			onSubmit={(e) => {
				e.preventDefault();
			}}
		>
			<input
				type="email"
				placeholder="Enter your email"
				className="h-10 px-4 bg-transparent border border-white/30 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-white w-full sm:w-64"
			/>
			<button
				type="submit"
				className="h-10 px-6 bg-white text-stone-900 text-xs tracking-widest uppercase font-semibold hover:bg-white/90 transition-colors shrink-0"
			>
				Subscribe
			</button>
		</form>
	);
}
