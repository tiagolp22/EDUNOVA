import { Link } from "react-router-dom";
import banner from "assets/imgs/edunova_banner.jpg";

export default function Banner({ t }) {

  return (
    <div className="relative w-full h-[320px]" id="home">
      <div className="absolute">
        <img
          src={banner}
          alt="banner"
          className="object-cover object-center w-full h-full"
        />
      </div>
      <div className="absolute inset-9 flex flex-col md:flex-row items-center justify-between">
        <div className="md:w-1/2 mb-4 md:mb-0">
          <h1 className=" text-[--azul-medio] md:text-6xl leading-tight my-8">
            {t("hero")}
          </h1>

          <Link
            to="/about"
            className="px-6 py-3 bg-[--azul-medio] text-white font-medium rounded-full hover:bg-[--amarelo]  transition duration-200"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  );
}
