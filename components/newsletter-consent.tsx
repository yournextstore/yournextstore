"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

/**
 * Marketing-permissions opt-in shown on every newsletter signup form.
 *
 * Themed by the store's own `Checkbox`, so it inherits each theme's palette rather than
 * carrying colours of its own. It posts under the `marketingConsent` field for plain
 * `<form action={...}>` submissions — kept as a literal on both sides because a constant
 * exported from this "use client" module would reach the server action as a client
 * reference, not a string. It also reports `checked` so the caller can keep its submit
 * button disabled until the shopper opts in; a native `required` here would block
 * submission through Radix's hidden input, which the browser cannot focus to explain.
 */
export function NewsletterConsent({
	checked,
	onCheckedChange,
	disabled,
	className,
}: {
	checked: boolean;
	onCheckedChange: (checked: boolean) => void;
	disabled?: boolean;
	className?: string;
}) {
	return (
		<Label className={cn("flex cursor-pointer items-start gap-2 text-left font-normal", className)}>
			<Checkbox
				name="marketingConsent"
				checked={checked}
				onCheckedChange={(value) => onCheckedChange(value === true)}
				disabled={disabled}
				className="mt-0.5 shrink-0"
			/>
			<span className="text-sm leading-snug opacity-80">
				I agree to receive marketing emails and accept the privacy policy. You can unsubscribe at any time.
			</span>
		</Label>
	);
}
