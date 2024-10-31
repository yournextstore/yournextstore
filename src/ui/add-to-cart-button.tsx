"use client";
import { useTranslations } from "@/i18n/client";
import { Button } from "@/ui/shadcn/button";
import { Loader2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

export const AddToCartButton = ({
	productId,
	disabled,
}: {
	productId: string;
	disabled?: boolean;
}) => {
	const t = useTranslations("Global.addToCart");
	const router = useRouter();
	const [pending, startTransition] = useTransition();
	const isDisabled = disabled || pending;

	return (
		<Button
			size="lg"
			type="submit"
			className="w-full rounded-full text-lg"
			onClick={async (e) => {
				if (isDisabled) {
					e.preventDefault();
					return;
				}
				startTransition(() => router.push(`/cart-overlay?add=${productId}`));
			}}
			aria-disabled={isDisabled}
		>
			{pending ? (
				<Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
			) : disabled ? (
				t("disabled")
			) : (
				t("actionButton")
			)}
		</Button>
	);
};
