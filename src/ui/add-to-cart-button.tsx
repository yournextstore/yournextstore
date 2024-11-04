"use client";
import { useTranslations } from "@/i18n/client";
import { cn } from "@/lib/utils";
import { Button } from "@/ui/shadcn/button";
import { Loader2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

export const AddToCartButton = ({
	productId,
	disabled,
	className,
}: {
	productId: string;
	disabled?: boolean;
	className?: string;
}) => {
	const t = useTranslations("Global.addToCart");
	const router = useRouter();
	const [pending, startTransition] = useTransition();
	const isDisabled = disabled || pending;

	return (
		<Button
			id="button-add-to-cart"
			size="lg"
			type="submit"
			className={cn("rounded-full text-lg relative", className)}
			onClick={async (e) => {
				if (isDisabled) {
					e.preventDefault();
					return;
				}
				startTransition(() => router.push(`/cart-overlay?add=${productId}`));
			}}
			aria-disabled={isDisabled}
		>
			<span className={cn("transition-opacity ease-in", pending ? "opacity-0" : "opacity-100")}>
				{disabled ? t("disabled") : t("actionButton")}
			</span>
			<span
				className={cn(
					"ease-out transition-opacity pointer-events-none absolute z-10",
					pending ? "opacity-100" : "opacity-0",
				)}
			>
				<Loader2Icon className="h-4 w-4 animate-spin" />
			</span>
		</Button>
	);
};
