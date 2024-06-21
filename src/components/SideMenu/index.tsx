import { FC } from "react";

interface Props {
  visabled: boolean;
  onChange: (visabled: boolean) => void;
}

const SideMenu: FC<Props> = ({ visabled, children, onChange }) => {
  const onHideMenu = () => {
    onChange(false);
  };

  return (
    visabled && (
      <div
        className="q-mask-bg animation-HideToDown fixed left-0 top-0 h-screen w-screen"
        onClick={onHideMenu}
      >
        <div
          className="q-bg left-0 top-0 z-10 w-full px-6 pb-6 pt-4"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="relative h-6">
            <button
              className="icon-[material-symbols--close] absolute right-0 cursor-pointer"
              style={{ width: "1.5rem", height: "1.5rem" }}
              onClick={onHideMenu}
            />
          </div>
          {children}
        </div>
      </div>
    )
  );
};

export default SideMenu;
