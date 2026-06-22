"use client";

export function NewsletterForm({ compact }: { compact?: boolean }) {
	return (
		<form
			className={compact ? "flex gap-2" : "flex flex-col sm:flex-row gap-3 max-w-md mx-auto"}
			onSubmit={(e) => e.preventDefault()}
		>
			<input
				type="email"
				placeholder={compact ? "Email" : "Email Address"}
				className={
					compact
						? "flex-1 h-10 px-4 rounded-full border-[2px] border-foreground bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#5aff24]"
						: "flex-1 h-14 px-6 rounded-full border-[3px] border-black bg-white text-black placeholder:text-black/40 text-base focus:outline-none focus:ring-2 focus:ring-[#5aff24]"
				}
			/>
			<button
				type="submit"
				className={
					compact
						? "h-10 px-5 bg-foreground text-primary-foreground rounded-full text-sm font-bold uppercase border-[2px] border-foreground hover:bg-foreground/90 transition-colors"
						: "h-14 px-8 bg-black text-white rounded-full text-base font-bold uppercase tracking-wide border-[3px] border-black shadow-[4px_4px_0_0_rgba(0,0,0,0.2)] hover:shadow-[2px_2px_0_0_rgba(0,0,0,0.2)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
				}
			>
				{compact ? "Go" : "Subscribe"}
			</button>
		</form>
	);
}
