"use client";

import { BellRing } from "lucide-react";
import { useActionState } from "react";
import { subscribeToRestock } from "@/app/product/[slug]/restock-action";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function RestockNotify({
	productVariantId,
	productName,
}: {
	productVariantId: string;
	productName: string;
}) {
	const [state, action, isPending] = useActionState(subscribeToRestock, null);

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button
					type="button"
					variant="outline"
					className="h-14 w-full rounded-full text-base font-medium tracking-wide"
				>
					<BellRing className="h-5 w-5" />
					Remind me when back in stock
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Get a restock alert</DialogTitle>
					<DialogDescription>We'll email you as soon as {productName} is back in stock.</DialogDescription>
				</DialogHeader>

				{state?.success ? (
					<p className="rounded-md bg-secondary/50 p-4 text-sm font-medium">{state.message}</p>
				) : (
					<form action={action} className="space-y-4">
						<input type="hidden" name="productVariantId" value={productVariantId} />
						<div className="space-y-1.5">
							<Label htmlFor="restock-email">Email</Label>
							<Input id="restock-email" name="email" type="email" required placeholder="your@email.com" />
						</div>
						{state?.error && <p className="text-sm text-destructive">{state.error}</p>}
						<Button type="submit" disabled={isPending} className="h-11 w-full rounded-full">
							{isPending ? "Submitting..." : "Notify me"}
						</Button>
					</form>
				)}
			</DialogContent>
		</Dialog>
	);
}
