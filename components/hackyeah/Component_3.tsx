import { Component_3_1 } from "./Component_3_1";

export function Component_3() {
	return (
		<div
			id="page-top"
			className="w-full absolute z-[100] items-center caret-[#dbdbdb]"
			data-component-id="Component_3"
		>
			<div className="w-full relative z-[10000] [backface-visibility:hidden] caret-[#dbdbdb] py-4">
				<Component_3_1 />
			</div>
		</div>
	);
}
