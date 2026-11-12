"use client";

import { useState } from "react";
import {
	GIFT_MESSAGE_MAX,
	GIFT_NAME_MAX,
	GIFT_SEND_WINDOW_DAYS,
	localDateString,
} from "@/app/product/[slug]/gift-card-properties";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

/** "Send as a gift" toggle for a gift card; its fields sit inside the add-to-cart form. */
export function GiftCardFields() {
	const [isGift, setIsGift] = useState(false);

	return (
		<div className="space-y-4">
			<Label className="flex cursor-pointer items-center gap-2">
				<Checkbox checked={isGift} onCheckedChange={(value) => setIsGift(value === true)} />
				Send as a gift
			</Label>
			{isGift && <RecipientFields />}
		</div>
	);
}

// Mounted only once the shopper ticks the box, so "today" is the browser's own day and never
// part of the prerendered page.
function RecipientFields() {
	const [message, setMessage] = useState("");
	const today = new Date();
	const lastDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + GIFT_SEND_WINDOW_DAYS);

	return (
		<div className="space-y-4 rounded-2xl border border-border p-4">
			<div className="space-y-1.5">
				<Label htmlFor="gift-recipient-email">Recipient email</Label>
				<Input
					id="gift-recipient-email"
					name="recipient_email"
					type="email"
					required
					autoComplete="off"
					placeholder="friend@example.com"
				/>
			</div>
			<div className="space-y-1.5">
				<Label htmlFor="gift-recipient-name">Recipient name (optional)</Label>
				<Input
					id="gift-recipient-name"
					name="recipient_name"
					type="text"
					maxLength={GIFT_NAME_MAX}
					autoComplete="off"
				/>
			</div>
			<div className="space-y-1.5">
				<div className="flex items-baseline justify-between gap-2">
					<Label htmlFor="gift-message">Message (optional)</Label>
					<span id="gift-message-count" className="text-xs text-muted-foreground">
						{message.length}/{GIFT_MESSAGE_MAX}
					</span>
				</div>
				<textarea
					id="gift-message"
					name="message"
					rows={3}
					maxLength={GIFT_MESSAGE_MAX}
					value={message}
					onChange={(event) => setMessage(event.target.value)}
					aria-describedby="gift-message-count"
					className="w-full rounded-md border border-input bg-background px-3 py-2 text-base md:text-sm resize-none"
				/>
			</div>
			<div className="space-y-1.5">
				<Label htmlFor="gift-send-on">Send on (optional)</Label>
				<Input
					id="gift-send-on"
					name="send_on"
					type="date"
					min={localDateString(today)}
					max={localDateString(lastDay)}
					aria-describedby="gift-send-on-hint"
				/>
				<p id="gift-send-on-hint" className="text-xs text-muted-foreground">
					Leave empty to send it right away.
				</p>
			</div>
		</div>
	);
}
