"use client";

import { Loader2Icon, XIcon } from "lucide-react";
import Image from "next/image";
import { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";
import { subscribeToNewsletter } from "@/app/newsletter/action";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "yns-newsletter-popup-dismissed";

type PopupStep = "cta" | "form" | "success";
type PopupState = "idle" | "open" | "dismissed";

interface NewsletterPopupSettings {
	delaySeconds?: number;
	heading?: string;
	subheading?: string;
	ctaText?: string;
	teaserText?: string;
	imageUrl?: string;
	discountCode?: string;
}

interface NewsletterDialogProps {
	settings?: NewsletterPopupSettings | null;
}

export function NewsletterDialog({ settings }: NewsletterDialogProps) {
	const [popupState, setPopupState] = useState<PopupState>("idle");
	const [showTeaser, setShowTeaser] = useState(false);
	const [isTeaserHidden, setIsTeaserHidden] = useState(false);
	const [step, setStep] = useState<PopupStep>("cta");
	const [email, setEmail] = useState("");
	const [isPending, startTransition] = useTransition();

	const delaySeconds = settings?.delaySeconds ?? 30;
	const heading = settings?.heading ?? "Unlock 20% Off";
	const subheading =
		settings?.subheading ?? "Subscribe to our newsletter and get an exclusive discount on your first order.";
	const ctaText = settings?.ctaText ?? "Get My Discount";
	const teaserText = settings?.teaserText ?? "Unlock 20% Off";
	const discountCode = settings?.discountCode;
	const imageUrl = settings?.imageUrl;

	useEffect(() => {
		const wasDismissed = localStorage.getItem(STORAGE_KEY) === "true";
		if (wasDismissed) return;

		// exit intent on desktop, timer fallback on mobile
		const open = () => {
			setPopupState("open");
			document.removeEventListener("mouseleave", handleExitIntent);
			clearTimeout(timer);
		};

		const handleExitIntent = (e: MouseEvent) => {
			if (e.clientY <= 0) open();
		};

		const timer = setTimeout(open, delaySeconds * 1000);

		document.addEventListener("mouseleave", handleExitIntent);
		return () => {
			document.removeEventListener("mouseleave", handleExitIntent);
			clearTimeout(timer);
		};
	}, [delaySeconds]);

	const handleDismiss = () => {
		setPopupState("dismissed");
		setShowTeaser(true);
		localStorage.setItem(STORAGE_KEY, "true");
	};

	const handleClose = () => {
		if (step === "success") {
			setPopupState("idle");
		} else {
			handleDismiss();
		}
	};

	const handleTeaserOpen = () => {
		setPopupState("open");
		setShowTeaser(false);
		setStep("cta");
		setEmail("");
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		startTransition(async () => {
			const formData = new FormData();
			formData.set("email", email);
			const result = await subscribeToNewsletter(null, formData);
			if (result?.success) {
				setStep("success");
				localStorage.setItem(STORAGE_KEY, "true");
			} else {
				toast.error(result?.error ?? "Failed to subscribe");
			}
		});
	};

	const dismissButton = (
		<button
			type="button"
			onClick={handleDismiss}
			className="text-muted-foreground hover:text-foreground text-sm transition-colors"
		>
			No thanks
		</button>
	);

	const panelClass = cn("flex flex-col justify-center p-6 sm:p-8", imageUrl ? "sm:w-1/2" : "w-full");

	return (
		<>
			<Dialog open={popupState === "open"} onOpenChange={(open) => !open && handleClose()}>
				<DialogContent className="gap-0 overflow-hidden border-0 p-0 sm:max-w-2xl md:max-w-3xl">
					<DialogTitle className="sr-only">{heading}</DialogTitle>
					<DialogDescription className="sr-only">{subheading}</DialogDescription>

					<div className="flex flex-col sm:flex-row">
						{imageUrl && (
							<div className="relative hidden min-h-75 bg-neutral-100 sm:block sm:w-1/2">
								<Image src={imageUrl} alt="" fill className="object-cover" unoptimized />
							</div>
						)}

						<div className={panelClass}>
							{step === "cta" && (
								<div className="space-y-4 text-center">
									<h2 className="text-2xl font-bold tracking-tight sm:text-3xl">{heading}</h2>
									<p className="text-muted-foreground">{subheading}</p>
									<div className="space-y-3 pt-2">
										<Button type="button" size="lg" className="w-full" onClick={() => setStep("form")}>
											{ctaText}
										</Button>
										{dismissButton}
									</div>
								</div>
							)}

							{step === "form" && (
								<div className="space-y-4">
									<div className="text-center">
										<h2 className="text-xl font-semibold">Enter your email</h2>
									</div>
									<form onSubmit={handleSubmit} className="space-y-3">
										<Input
											type="email"
											placeholder="your@email.com"
											value={email}
											onChange={(e) => setEmail(e.target.value)}
											required
											autoFocus
											className="text-center"
										/>
										<Button type="submit" size="lg" className="w-full" disabled={!email || isPending}>
											{isPending ? <Loader2Icon className="size-4 animate-spin" /> : "Subscribe"}
										</Button>
									</form>
									<div className="text-center">{dismissButton}</div>
								</div>
							)}

							{step === "success" && (
								<div className="space-y-4 text-center">
									<h2 className="text-2xl font-bold">You&apos;re in!</h2>
									<p className="text-muted-foreground">
										Thanks for subscribing. Check your inbox for your offer.
									</p>
									{discountCode && (
										<div className="py-3">
											<p className="text-muted-foreground mb-2 text-sm">Your code</p>
											<div className="inline-block rounded-md bg-neutral-100 px-4 py-2 font-mono text-lg font-semibold">
												{discountCode}
											</div>
										</div>
									)}
									<Button type="button" size="lg" className="w-full" onClick={() => setPopupState("idle")}>
										Continue shopping
									</Button>
								</div>
							)}
						</div>
					</div>
				</DialogContent>
			</Dialog>

			{showTeaser && !isTeaserHidden && (
				<div className="fixed bottom-4 left-4 z-50 flex items-center gap-2">
					<button
						type="button"
						onClick={handleTeaserOpen}
						className="bg-primary text-primary-foreground rounded-full px-4 py-2.5 text-sm font-medium shadow-lg transition-opacity hover:opacity-90"
					>
						{teaserText}
					</button>
					<button
						type="button"
						onClick={() => setIsTeaserHidden(true)}
						className="rounded-full bg-neutral-100 p-1.5 text-neutral-600 shadow-sm transition-colors hover:bg-neutral-200 hover:text-neutral-900"
						aria-label="Dismiss"
					>
						<XIcon className="h-3.5 w-3.5" />
					</button>
				</div>
			)}
		</>
	);
}
