import logo from "assets/imgs/EduNova_logo.gif";
import { Link, NavLink, useNavigate } from "react-router-dom";

export default function Menu({ t, handleTrans, language }) {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <header>
      <nav className="flex flex-wrap items-center justify-between p-3 bg-[--azul-escuro]">
        <div className="text-xl">
          <Link to="/">
            <img src={logo} alt="Logo EduNova" width="200" height="200" />
          </Link>
        </div>
        <div className="flex md:hidden">
          <button id="hamburger">
            <img
              className="toggle block"
              src="https://img.icons8.com/fluent-systems-regular/2x/menu-squared-2.png"
              width="40"
              height="40"
              alt="Icon"
            />
            <img
              className="toggle hidden"
              src="https://img.icons8.com/fluent-systems-regular/2x/close-window.png"
              width="40"
              height="40"
              alt="Icon"
            />
          </button>
        </div>
        <div className="toggle hidden w-full md:w-auto md:flex text-[--amarelo] text-right text-bold mt-3 md:mt-0 md:border-none">
          <NavLink
            to="/"
            className="block md:inline-block hover:text-blue-500 px-3 py-3 md:border-none"
          >
            Home
          </NavLink>
          <NavLink
            to="/services"
            className="block md:inline-block hover:text-blue-500 px-3 py-3 md:border-none"
          >
            {t("nav_services")}
          </NavLink>
          <NavLink
            to="/about"
            className="block md:inline-block hover:text-blue-500 px-3 py-3 md:border-none"
          >
            {t("nav_about")}
          </NavLink>
          <NavLink
            to="/contactUs"
            className="block md:inline-block hover:text-blue-500 px-3 py-3 md:border-none"
          >
            {t("nav_contact")}
          </NavLink>
        </div>

        <div className="toggle w-full text-end hidden md:flex md:w-auto px-2 py-2 md:rounded">
          {user ? (
            <div className="flex items-center text-[--amarelo]">
              <p className="mr-4">
                {t("Hello")}, {user.username}
              </p>
              <button
                onClick={handleLogout}
                className="text-[--amarelo] hover:text-blue-500"
              >
                logout
              </button>
            </div>
          ) : (
            <NavLink to="/signup">
              <div className="flex justify-end">
                <div className="flex items-center h-10 w-30 rounded-md bg-[--amarelo] text-[--azul-escuro] font-medium p-2">
                  Login / Sign up
                </div>
              </div>
            </NavLink>
          )}

          <div className="Flex top-0 right-0 mx-6 text-[#446ca2]">
            {language === "en" ? (
              <button
                onClick={() => handleTrans("pt")}
                className="py-2 flex text-lg"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512 512"
                  fill="currentColor"
                  width="20px"
                  height="20px"
                  className="mr-2 mt-1 fill-[#446ca2]"
                >
                  <path d="M352 256c0 22.2-1.2 43.6-3.3 64H163.3c-2.2-20.4-3.3-41.8-3.3-64s1.2-43.6 3.3-64H348.7c2.2 20.4 3.3 41.8 3.3 64zm28.8-64H503.9c5.3 20.5 8.1 41.9 8.1 64s-2.8 43.5-8.1 64H380.8c2.1-20.6 3.2-42 3.2-64s-1.1-43.4-3.2-64zm112.6-32H376.7c-10-63.9-29.8-117.4-55.3-151.6c78.3 20.7 142 77.5 171.9 151.6zm-149.1 0H167.7c6.1-36.4 15.5-68.6 27-94.7c10.5-23.6 22.2-40.7 33.5-51.5C239.4 3.2 248.7 0 256 0s16.6 3.2 27.8 13.8c11.3 10.8 23 27.9 33.5 51.5c11.6 26 20.9 58.2 27 94.7zm-209 0H18.6C48.6 85.9 112.2 29.1 190.6 8.4C165.1 42.6 145.3 96.1 135.3 160zM8.1 192H131.2c-2.1 20.6-3.2 42-3.2 64s1.1 43.4 3.2 64H8.1C2.8 299.5 0 278.1 0 256s2.8-43.5 8.1-64zM194.7 446.6c-11.6-26-20.9-58.2-27-94.6H344.3c-6.1 36.4-15.5 68.6-27 94.6c-10.5 23.6-22.2 40.7-33.5 51.5C272.6 508.8 263.3 512 256 512s-16.6-3.2-27.8-13.8c-11.3-10.8-23-27.9-33.5-51.5zM135.3 352c10 63.9 29.8 117.4 55.3 151.6C112.2 482.9 48.6 426.1 18.6 352H135.3zm358.1 0c-30 74.1-93.6 130.9-171.9 151.6c25.5-34.2 45.2-87.7 55.3-151.6H493.4z" />
                </svg>
                PT
              </button>
            ) : (
              <button
                onClick={() => handleTrans("en")}
                className="py-2 flex text-lg"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512 512"
                  fill="currentColor"
                  width="20px"
                  height="20px"
                  className="mr-2 mt-1 fill-[#446ca2]"
                >
                  <path d="M352 256c0 22.2-1.2 43.6-3.3 64H163.3c-2.2-20.4-3.3-41.8-3.3-64s1.2-43.6 3.3-64H348.7c2.2 20.4 3.3 41.8 3.3 64zm28.8-64H503.9c5.3 20.5 8.1 41.9 8.1 64s-2.8 43.5-8.1 64H380.8c2.1-20.6 3.2-42 3.2-64s-1.1-43.4-3.2-64zm112.6-32H376.7c-10-63.9-29.8-117.4-55.3-151.6c78.3 20.7 142 77.5 171.9 151.6zm-149.1 0H167.7c6.1-36.4 15.5-68.6 27-94.7c10.5-23.6 22.2-40.7 33.5-51.5C239.4 3.2 248.7 0 256 0s16.6 3.2 27.8 13.8c11.3 10.8 23 27.9 33.5 51.5c11.6 26 20.9 58.2 27 94.7zm-209 0H18.6C48.6 85.9 112.2 29.1 190.6 8.4C165.1 42.6 145.3 96.1 135.3 160zM8.1 192H131.2c-2.1 20.6-3.2 42-3.2 64s1.1 43.4 3.2 64H8.1C2.8 299.5 0 278.1 0 256s2.8-43.5 8.1-64zM194.7 446.6c-11.6-26-20.9-58.2-27-94.6H344.3c-6.1 36.4-15.5 68.6-27 94.6c-10.5 23.6-22.2 40.7-33.5 51.5C272.6 508.8 263.3 512 256 512s-16.6-3.2-27.8-13.8c-11.3-10.8-23-27.9-33.5-51.5zM135.3 352c10 63.9 29.8 117.4 55.3 151.6C112.2 482.9 48.6 426.1 18.6 352H135.3zm358.1 0c-30 74.1-93.6 130.9-171.9 151.6c25.5-34.2 45.2-87.7 55.3-151.6H493.4z" />
                </svg>
                EN
              </button>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}
