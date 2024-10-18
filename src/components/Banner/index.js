import styles from "./Banner.module.css";
import banner from "assets/imgs/edunova_banner.jpg";

export default function Banner() {
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
          <h1 className="text-grey-700 font-medium text-[--azul-medio] text-4xl md:text-5xl leading-tight mb-8">
            Seu aprendizado, no seu ritmo, em qualquer lugar.
          </h1>

          <a
            href="#contactUs"
            className="px-6 py-3 bg-[#c8a876] text-white font-medium rounded-full hover:bg-[#c09858]  transition duration-200"
          >
            Contact Us
          </a>
        </div>
      </div>
    </div>
  );
}
