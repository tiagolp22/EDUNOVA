import styles from "./Menu.module.css";
import logo from "assets/imgs/EduNova_logo.gif";
import { Link, NavLink } from "react-router-dom";

export default function Menu() {
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
              />
              <img
                className="toggle hidden"
                src="https://img.icons8.com/fluent-systems-regular/2x/close-window.png"
                width="40"
                height="40"
              />
            </button>
          </div>
          <div className=" toggle hidden w-full md:w-auto md:flex text-[--amarelo] text-right text-bold mt-3 md:mt-0 md:border-none">
            <NavLink
              to="/"
              className="block md:inline-block hover:text-blue-500 px-3 py-3 md:border-none"
            >
              Home
            </NavLink>
            <NavLink
              href="#services"
              className="block md:inline-block hover:text-blue-500 px-3 py-3 md:border-none"
            >
              Services
            </NavLink>
            <NavLink
              href="#aboutus"
              className="block md:inline-block hover:text-blue-500 px-3 py-3 md:border-none"
            >
              About us
            </NavLink>
            <NavLink
              href="#gallery"
              className="block md:inline-block hover:text-blue-500 px-3 py-3 md:border-none"
            >
              Gallery
            </NavLink>
            <NavLink
              href="#contactUs"
              className="block md:inline-block hover:text-blue-500 px-3 py-3 md:border-none"
            >
              Visit Us
            </NavLink>
          </div>

          <div className="toggle w-full text-end hidden md:flex md:w-auto px-2 py-2 md:rounded">
            <NavLink href="tel:+123">
              <div className="flex justify-end">
                <div className="flex items-center h-10 w-30 rounded-md bg-[--amarelo] text-[--azul-escuro] font-medium p-2">
                  Login / Sign up
                </div>
              </div>
            </NavLink>
          </div>
        </nav>
      
    </header>
  );
}
