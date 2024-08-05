"use client";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useTransition } from "react";
import { Loader2Icon } from "lucide-react";
import { Button } from "@/ui/shadcn/button";

export const AddToCartButton = ({ productId }: { productId: string }) => {
	const t = useTranslations("Global.addToCart");
	const router = useRouter();
	const [pending, startTransition] = useTransition();

	return (
		<Button
			size="lg"
			type="submit"
			className="w-full rounded-full text-lg"
			onClick={async () => {
				startTransition(() => router.push(`/cart-overlay?add=${productId}`));
			}}
			aria-disabled={pending}
		>
			{pending ? <Loader2Icon className="mr-2 h-4 w-4 animate-spin" /> : t("actionButton")}
		</Button>
	);
};
