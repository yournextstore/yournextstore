import { Component_12_1 } from "./Component_12_1";

export function Component_12() {
	return (
		<div
			id="offcanvas-wrapper"
			className="bg-[#1b132d] w-full h-full fixed z-[99999] hidden flex-col caret-[#dbdbdb] left-auto right-0 top-0 bottom-auto"
			data-component-id="Component_12"
		>
			<div className="text-white caret-white py-8">
				<div className="caret-white">
					<a
						href="https://hackyeah.pl/"
						className="text-[24px] text-center block caret-white hover:text-[#2ebcfc]"
					>
						<img
							width="115"
							height="71"
							src="https://hackyeah.pl/wp-content/uploads/2023/02/hy-logo-new.png"
							alt="HackYeah 2025 – the biggest on-site hackathon in Europe"
							className="align-middle max-w-4/5 max-h-[70px] aspect-[auto_115_/_71] block basis-0 caret-white m-auto"
						/>
					</a>
				</div>
			</div>
			<Component_12_1 />
		</div>
	);
}
