import { Link } from "react-router-dom";
import styles from"./Banner.module.css";
import banner from "assets/imgs/edunova_banner.png";

export default function Banner({ t }) {
  return (
    <div className={styles.hero_banner}>
      <img
        src={banner}
        alt="Edunova banner"
        className="w-full h-full object-cover object-center"
      />
      <div className={styles.hero_content}>
        <div className={styles.hero_content_block}>
          <h1>{t("hero1")}</h1>
          <h1>{t("hero2")}</h1>
          <h1>{t("hero3")}</h1>
          <Link
            to="/about"
            className="inline-block px-4 py-2 sm:px-5 sm:py-2.5 md:px-6 md:py-3 bg-[--azul-medio] text-white text-[2vw] sm:text-[1.8vw] md:text-[1.5vw] font-medium rounded-full hover:bg-[--amarelo] transition duration-200"
          >
            {t("btn_aboutUs")}
          </Link>
        </div>
      </div>
    </div>
  );
}
