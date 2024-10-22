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

          <div className={styles.hero_title}>
            <h1>{t("hero1")}</h1>
            <h1>{t("hero2")}</h1>
            <h1>{t("hero3")}</h1>
          </div>

          <Link
            to="/about"
            className={styles.hero_button}
          >
            {t("btn_aboutUs")}
          </Link>
        </div>
      </div>
    </div>
  );
}
