import { Logo, message } from "@/components";
import { BASE_CONFIG } from "@/config";
import { copyToClipboard } from "@/utils";

const { copyright, name, github, email, juejin } = BASE_CONFIG;

const Footer = () => {
	const onClickEmail = () => {
		copyToClipboard(email);
		message.info({
			title: "系统通知",
			content: "复制成功",
		});
	};

	return (
		<footer className="mx-auto w-full px-6">
			<div className="q-secondary container mx-auto flex flex-col items-center justify-between gap-1 border-t py-6 sm:flex-row">
				<Logo style={{ transform: "scale(0.7)" }} />
				<p className="text-xs leading-5">
					{copyright} by {name}
				</p>
				<span className="flex items-center gap-3">
					<span
						className="q-color-primary-hover icon-[clarity--email-solid] cursor-pointer"
						style={{ width: "1.5rem", height: "1.5rem" }}
						title={email}
						onClick={onClickEmail}
					/>
					<a
						className="q-color-primary-hover icon-[simple-icons--juejin] cursor-pointer"
						style={{ width: "1.5rem", height: "1.5rem" }}
						title={juejin}
						href={juejin}
						target="_blank"
						rel="noopener noreferrer"
					/>
					<a
						className="q-color-primary-hover icon-[octicon--mark-github-24] cursor-pointer"
						style={{ width: "1.5rem", height: "1.5rem" }}
						title={github}
						href={github}
						target="_blank"
						rel="noopener noreferrer"
					/>
				</span>
			</div>
		</footer>
	);
};

export default Footer;
