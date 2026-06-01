"use client";

import { ArrowRightIcon, CheckIcon } from "lucide-react";
import { useActionState } from "react";
import { sendContactMessage } from "@/app/contact/action";

export function ContactForm() {
	const [state, action, isPending] = useActionState(sendContactMessage, null);

	if (state?.success) {
		return (
			<div className="rounded-lg border border-border bg-secondary/30 p-8 text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
				<div className="mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-foreground/5">
					<CheckIcon className="h-6 w-6" />
				</div>
				<h2 className="text-2xl font-medium tracking-tight">Message sent</h2>
				<p className="mt-2 text-muted-foreground">{state.message}</p>
			</div>
		);
	}

	return (
		<form action={action} className="space-y-4">
			<div>
				<label htmlFor="contact-email" className="block text-sm font-medium text-foreground">
					Email
				</label>
				<input
					id="contact-email"
					type="email"
					name="email"
					placeholder="your@email.com"
					required
					className="mt-2 h-12 w-full rounded-lg border border-border bg-background px-4 text-foreground outline-none transition-all placeholder:text-muted-foreground/60 focus:border-foreground/40 focus:ring-2 focus:ring-foreground/10"
				/>
			</div>
			<div>
				<label htmlFor="contact-message" className="block text-sm font-medium text-foreground">
					Message
				</label>
				<textarea
					id="contact-message"
					name="message"
					placeholder="How can we help?"
					required
					rows={6}
					className="mt-2 w-full rounded-lg border border-border bg-background px-4 py-3 text-foreground outline-none transition-all placeholder:text-muted-foreground/60 focus:border-foreground/40 focus:ring-2 focus:ring-foreground/10"
				/>
			</div>
			<button
				type="submit"
				disabled={isPending}
				className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-foreground px-8 font-medium text-background transition-all hover:bg-foreground/90 disabled:opacity-50"
			>
				{isPending ? "Sending…" : "Send message"}
				{!isPending && <ArrowRightIcon className="h-4 w-4" />}
			</button>
			{state?.error && <p className="text-sm text-red-500">{state.error}</p>}
		</form>
	);
}
