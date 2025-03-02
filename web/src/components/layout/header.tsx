/*
Header comoponent of the application
*/
const Header = () => {
  return (
    <div className="h-2/5 max-h-[100px] bg-[#002D72] flex">
      <div>
        <object
          type="image/svg+xml"
          data="/assets/JHU.logo_horizontal.white.svg"
          className="h-[100px]"
        >
          JHU Logo
        </object>
      </div>

      <div className="text-5xl self-center right-[calc(50vw-399px/2)] font-[Quadon] text-white">
        WSE Manufacturing
      </div>
    </div>
  );
};

export default Header;
