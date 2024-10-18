import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import bannerEN from "assets/imgs/edunova_bannerEN.jpg";
import bannerPT from "assets/imgs/edunova_bannerPT.jpg";

export default function Banner({ t }) {
  const [currentBanner, setCurrentBanner] = useState(bannerPT);

  useEffect(() => {
    const chosenLanguage = localStorage.getItem("chosenLanguage");
    setCurrentBanner(chosenLanguage === "en" ? bannerEN : bannerPT);
  }, []);

  return (
    <div className="relative w-full h-[320px] sm:h-auto" id="home">
      <img
        src={currentBanner}
        alt={t("bannerAltText", "Edunova banner")}
        className="w-full h-full object-cover object-center"
      />
      <div className="absolute inset-x-14 top-24 sm:bottom-[60%] md:top-60 flex flex-col md:flex-row items-start justify-between">
        <div className="md:w-1/2">
          <Link
            to="/about"
            className="inline-block px-4 py-2 sm:px-5 sm:py-2.5 md:px-6 md:py-3 bg-[--azul-medio] text-white text-[2vw] sm:text-[1.8vw] md:text-[1.5vw] font-medium rounded-full hover:bg-[--amarelo] transition duration-200"
          >
            {t("contactUs", "Contact Us")}
          </Link>
        </div>
      </div>
    </div>
  );
}
