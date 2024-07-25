import { FC } from "react";

import { useLogin } from "@/provider";

interface DialogProps {
	visabled: boolean;
	title: string;
}
const Dialog: FC<DialogProps> = ({ visabled, title, children }) => {
	const { closeLogin } = useLogin();

	const onClose = () => {
		closeLogin();
	};

	return visabled ? (
		<div
			className={`fixed inset-0 left-0 top-0 z-40 flex items-center justify-center backdrop-blur-md ${visabled ? "animation-HideToDown block" : "hidden"}`}
		>
			<div className="q-bg mx-auto max-w-md rounded p-4 shadow-md">
				<h2 className="mb-6 flex items-center justify-between text-xl font-bold">
					<span>{title}</span>
					<button
						className="q-color-primary-hover icon-[material-symbols--close] cursor-pointer"
						onClick={onClose}
					/>
				</h2>
				{children}
			</div>
		</div>
	) : (
		<></>
	);
};

export default Dialog;
