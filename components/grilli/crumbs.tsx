import Link from "next/link";
import { Fragment } from "react";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { cn } from "@/lib/utils";

/** Spaced uppercase breadcrumbs; the current page in gold. */
export function Crumbs({
	trail,
	current,
	className,
}: {
	trail: { href: string; label: string }[];
	current: string;
	className?: string;
}) {
	return (
		<Breadcrumb className={cn("mt-6", className)}>
			<BreadcrumbList className="justify-center text-label-2 font-bold tracking-3 text-silver uppercase">
				{trail.map((crumb) => (
					<Fragment key={crumb.href}>
						<BreadcrumbItem>
							<BreadcrumbLink asChild>
								<Link href={crumb.href} className="hover:text-gold">
									{crumb.label}
								</Link>
							</BreadcrumbLink>
						</BreadcrumbItem>
						<BreadcrumbSeparator />
					</Fragment>
				))}
				<BreadcrumbItem>
					<BreadcrumbPage className="text-gold">{current}</BreadcrumbPage>
				</BreadcrumbItem>
			</BreadcrumbList>
		</Breadcrumb>
	);
}
