import styles from "./Banner.module.css";
import banner_VM from "../../assets/imgs/banner_VM.jpg";

export default function Banner() {
  return <img src={banner_VM} alt="Banner do site Visible Mending" className={styles.hero_banner}/>;
}
