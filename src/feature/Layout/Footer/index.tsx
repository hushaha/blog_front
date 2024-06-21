import { BASE_CONFIG } from "@/config";

const { copyright, github, name } = BASE_CONFIG;

const Footer = () => {
  return (
    <footer className="q-secondary w-full py-8 text-center text-sm">
      <p>
        Designed & developed by
        <a className="pl-1" target="_blank" href={github} rel="noreferrer">
          {name}
        </a>
      </p>
      <p>{copyright}</p>
    </footer>
  );
};

export default Footer;
