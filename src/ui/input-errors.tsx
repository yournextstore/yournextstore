import { type ComponentProps, type ReactNode, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export interface ElWithErrorsProps extends ComponentProps<"input"> {
	errors: undefined | null | Record<string, string[] | undefined | null>;
	label: string;
}

export const ElWithErrors = ({
	errors,
	name,
	className,
	label,
	children,
	...props
}: Omit<ElWithErrorsProps, "children"> & {
	children: (props: ComponentProps<"input">) => ReactNode;
}) => {
	const currentErrors = errors && name && name in errors ? errors[name] : null;
	const id = name ? `input-${name}` : undefined;

	const child = useMemo(() => {
		return children({
			...props,
			name,
			className: cn(className, currentErrors?.length && "border-destructive"),
			"aria-invalid": !!currentErrors?.length,
			"aria-errormessage": id,
		});
	}, [children, className, currentErrors?.length, id, name, props]);

	return (
		<Label>
			<span>{label}</span>
			<span id={id} aria-live="assertive">
				{currentErrors?.map((error) => (
					<span key={error} className="ml-2 text-xs leading-none text-destructive">
						{error}
					</span>
				))}
			</span>
			{child}
		</Label>
	);
};

export const InputWithErrors = (props: ElWithErrorsProps) => {
	return <ElWithErrors {...props}>{(innerProps) => <Input {...innerProps} />}</ElWithErrors>;
};
