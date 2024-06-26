import Logo from "@/assets/imgs/logo.svg";
import { BASE_CONFIG } from "@/config";

const { copyright, name, github } = BASE_CONFIG;

const Footer = () => {
  const onClickGitHub = () => {
    window.open(github);
  };

  return (
    <footer className="mx-auto mt-8 w-full px-6 sm:mt-16">
      <div className="q-secondary container mx-auto flex flex-col items-center justify-between gap-1 border-t py-6 sm:flex-row">
        <Logo style={{ transform: "scale(0.7)" }} />
        <p className="text-xs leading-5">
          {copyright} by {name}
        </p>
        <span className="flex items-center">
          <span
            className="q-color-primary-hover icon-[octicon--mark-github-24] cursor-pointer"
            style={{ width: "1.5rem", height: "1.5rem" }}
            onClick={onClickGitHub}
          />
        </span>
      </div>
    </footer>
  );
};

export default Footer;
